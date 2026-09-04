#!/usr/bin/env bash

set -euo pipefail

for required_tool in \
  /usr/bin/base64 \
  /usr/bin/env \
  /usr/bin/openssl \
  /usr/bin/readlink \
  /usr/bin/sha256sum
do
  if [ ! -x "$required_tool" ]; then
    echo "Inventory refused: a required system tool is unavailable." >&2
    exit 1
  fi
done

case "$HOME" in
  /*) ;;
  *)
    echo "Inventory refused: the SSH home directory is invalid." >&2
    exit 1
    ;;
esac

app_pid=""
node_executable=""
for candidate in "$HOME"/.pm2/pids/digitaldot.ro-*.pid; do
  [ -f "$candidate" ] && [ ! -L "$candidate" ] || continue

  candidate_pid="$(<"$candidate")"
  case "$candidate_pid" in
    ""|*[!0-9]*) continue ;;
  esac

  if ! candidate_executable="$(
    /usr/bin/readlink -f -- "/proc/$candidate_pid/exe" 2>/dev/null
  )"; then
    continue
  fi
  case "$candidate_executable" in
    */node)
      app_pid="$candidate_pid"
      node_executable="$candidate_executable"
      break
      ;;
  esac
done

if [ -z "$app_pid" ] || [ -z "$node_executable" ]; then
  echo "Inventory refused: no live Node.js application PID was found." >&2
  exit 1
fi

if [ ! -x "$node_executable" ]; then
  echo "Inventory refused: the live Node.js executable is unavailable." >&2
  exit 1
fi

decoded_script_hash="$(
  printf "%s" "$INVENTORY_SCRIPT_B64" \
    | /usr/bin/base64 --decode \
    | /usr/bin/sha256sum
)"
decoded_script_hash="${decoded_script_hash%% *}"
decoded_certificate_hash="$(
  printf "%s" "$INVENTORY_CERT_B64" \
    | /usr/bin/base64 --decode \
    | /usr/bin/sha256sum
)"
decoded_certificate_hash="${decoded_certificate_hash%% *}"

if [ "$decoded_script_hash" != "$INVENTORY_SCRIPT_SHA256" ] || \
   [ "$decoded_certificate_hash" != "$INVENTORY_CERT_SHA256" ]; then
  echo "Inventory refused: the in-memory payload failed integrity verification." >&2
  exit 1
fi

inventory_runtime=(
  /usr/bin/env -i
  PATH=/usr/bin:/bin
  LANG=C
  LC_ALL=C
  GIT_OPTIONAL_LOCKS=0
  GIT_CONFIG_NOSYSTEM=1
  GIT_CONFIG_GLOBAL=/dev/null
)
if [ -x /usr/bin/nice ]; then
  inventory_runtime+=(/usr/bin/nice -n 10)
fi
if [ -x /usr/bin/ionice ]; then
  inventory_runtime+=(/usr/bin/ionice -c 2 -n 7)
fi
inventory_runtime+=("$node_executable")

encrypted_payload="$(
  printf "%s" "$INVENTORY_SCRIPT_B64" \
    | /usr/bin/base64 --decode \
    | "${inventory_runtime[@]}" \
        --input-type=module - \
        --checkout /home/digitaldot/htdocs/digitaldot.ro \
        --app digitaldot.ro \
        --pm2-home "$HOME/.pm2" \
    | /usr/bin/env -i \
        PATH=/usr/bin:/bin \
        LANG=C \
        LC_ALL=C \
        HOME=/nonexistent \
        RANDFILE=/dev/null \
        OPENSSL_CONF=/dev/null \
        /usr/bin/openssl cms \
          -encrypt \
          -binary \
          -aes256 \
          -outform DER \
          <(printf "%s" "$INVENTORY_CERT_B64" | /usr/bin/base64 --decode) \
    | /usr/bin/base64 -w 0
)"

if [ "${#encrypted_payload}" -lt 128 ]; then
  echo "Inventory refused: encrypted report output is incomplete." >&2
  exit 1
fi

printf "DIGITALDOT_INVENTORY_CMS_DER_BASE64=%s\n" "$encrypted_payload"
