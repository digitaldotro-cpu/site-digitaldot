# Controlul deploy-ului în producție

## Stare

Acest circuit este intenționat **dezactivat și NO-GO pentru orice deploy** până
când toate condițiile de mai jos sunt confirmate separat. Aprobarea sau merge-ul
PR-ului care conține workflow-ul nu autorizează accesul la server și nu
autorizează un deploy.

## Ce garantează workflow-ul GitHub

- nu pornește la merge sau la push; poate fi cerut numai manual;
- acceptă numai SHA-ul complet care este simultan commitul workflow-ului și
  vârful curent al ramurii `main`;
- revalidează `main` după aprobarea Environment-ului `production`;
- referă secretele numai în jobul protejat de Environment;
- verifică mai întâi identitatea ED25519 a serverului, fără cheia privată;
- folosește apoi o cheie de deploy dedicată și OpenSSH nativ;
- cere serverului numai comanda restrânsă `deploy <SHA>`;
- nu afișează ieșirea brută a serverului în logurile publice;
- acceptă drept succes numai o singură confirmare exactă:
  `DIGITALDOT_DEPLOY_RESULT=SUCCESS:<SHA>`.

Workflow-ul păstrează cererile concurente într-o singură coadă, dar refuză o
cerere veche dacă `main` a avansat înainte de aprobarea ei.

## Cele patru secrete dedicate

Aceste valori se creează numai în Environment-ul GitHub `production`, nu la
nivel de repository sau organizație:

- `PRODUCTION_DEPLOY_HOST`;
- `PRODUCTION_DEPLOY_USERNAME`;
- `PRODUCTION_DEPLOY_SSH_KEY`;
- `PRODUCTION_DEPLOY_HOST_FINGERPRINT`.

Cheia de deploy trebuie să fie diferită de cheia folosită pentru inventarul
read-only. Valorile se introduc direct în GitHub și nu se trimit în chat, PR,
issue, log sau fișier versionat.

Aceasta este o condiție operațională, nu o proprietate pe care YAML-ul o poate
demonstra singur. Înainte de activare se verifică în setările GitHub că cele
patru nume există exclusiv în Environment și că nu există copii la nivel de
repository sau organizație.

Secretele vechi `SERVER_HOST`, `SERVER_USERNAME` și `SERVER_SSH_KEY` nu se șterg
înainte ca noile valori să fie instalate și verificate. Ștergerea lor și
revocarea cheii vechi cer o confirmare separată. Niciun workflow de producție nu
se rulează cât timp copiile vechi există la nivel general.

## Contractul obligatoriu al serverului

Cheia dedicată trebuie instalată cu o regulă SSH forced-command echivalentă cu:

```text
restrict,command="/usr/local/sbin/digitaldot-deploy-gateway" <cheia-publică>
```

Fișierul de chei autorizate, gateway-ul și toate directoarele lor părinte trebuie
să fie controlate de administrator și să nu poată fi modificate de utilizatorul
de deploy. Gateway-ul trebuie să aibă un `PATH` fix, să nu încarce profile de
shell, să nu evalueze text și să accepte exclusiv `SSH_ORIGINAL_COMMAND` în forma
`deploy <40-caractere-hex-lowercase>`. Orice stdin, argument suplimentar,
caracter de control sau comandă diferită trebuie refuzată.

Gateway-ul trebuie, înainte de prima mutație a aplicației:

1. să ia un lock unic de producție;
2. să confirme repository-ul remote așteptat și să aducă `main` fără
   credențiale Git persistente;
3. să confirme că ținta este exact în `main`, că nu este downgrade sau istoric
   divergent și că deploy-ul repetat este tratat idempotent;
4. să refuze modificările urmărite neconfirmate;
5. să confirme backupul și migrarea datelor dashboardului;
6. să seteze sursa controlată pentru `DIGITALDOT_DATA_ROOT` și să ruleze explicit
   `npm run check:storage -- --require-external`, refuzând variabila lipsă,
   rădăcina neexternă, structura incompletă ori uploadurile legacy care ar umbri
   ruta persistentă;
7. să selecteze un Node 24 deja instalat, fără instalare automată, să folosească
   aceeași versiune la instalare și build și să confirme după restart că PM2
   rulează efectiv aplicația cu Node 24;
8. să folosească aceeași configurare `DIGITALDOT_DATA_ROOT` pentru build și PM2;
9. să construiască într-un release separat de versiunea activă;
10. să activeze atomic release-ul, să facă health check pentru SHA-ul exact și să
   revină automat la release-ul anterior dacă restartul sau verificarea eșuează.

Gateway-ul nu trebuie să folosească `git reset --hard`, `git clean`, ștergeri
recursive ori sincronizări destructive asupra conținutului, uploadurilor,
logurilor sau rădăcinii persistente. În stdout/stderr nu trebuie să trimită
output brut de la Git, npm, build, PM2 sau health check. La succes emite exact o
singură linie din contractul de mai sus; la eșec se închide cu status nenul fără
date sensibile.

## Ordinea de activare

1. Se finalizează inventarul read-only din PR-ul dedicat.
2. Se confirmă calea storage, backupul și migrarea datelor.
3. Administratorul instalează gateway-ul și cheia forced-command.
4. Cele patru secrete noi sunt create în Environment-ul `production`; se
   verifică numai numele, niciodată valorile în log.
5. Gateway-ul, lockul, no-op-ul, health checkul și rollbackul sunt testate fără
   a schimba site-ul live.
6. Cu o confirmare separată se șterg secretele generale și se revocă cheia
   veche.
7. PR-ul de control poate fi integrat cât timp workflow-ul rămâne dezactivat.
8. După merge se verifică explicit starea `disabled_manually` și faptul că nu a
   fost creată nicio rulare pentru merge.
9. Activarea workflow-ului și primul deploy manual sunt două autorizări de
   producție separate.

Până la încheierea acestor pași, site-ul live și serverul nu se modifică.
