# Migrarea sigură a datelor dashboardului

## Scop

Această procedură mută datele modificabile ale site-ului în afara checkout-ului Git, fără a pierde:

- conținutul salvat din `/panou-control`;
- datele CMS păstrate pentru compatibilitate;
- logurile formularelor de contact;
- imaginile încărcate din dashboard.

Procedura este intenționat separată de merge și de deploy. Un PR aprobat nu autorizează executarea pașilor pe server.

## Structura țintă

Valoarea exactă pentru `DIGITALDOT_DATA_ROOT` trebuie confirmată înainte de migrare. Structura de sub ea este:

```text
<DIGITALDOT_DATA_ROOT>/
├── content/
│   ├── site-content.json
│   ├── cms-data.json
│   └── logs/
└── public/
    └── uploads/
```

Directorul trebuie să fie în afara checkout-ului aplicației și să nu fie un părinte al acestuia.

## Condiții înainte de intervenție

1. Schimbarea de cod este aprobată și verificată, dar nu este încă deployată.
2. Deploy-ul automat rămâne oprit; se folosește ulterior un deploy manual pentru un SHA exact.
3. Este stabilită o fereastră scurtă de mentenanță în care dashboardul și formularul nu pot produce scrieri noi.
4. Sunt identificate utilizatorul real al procesului PM2, checkout-ul real și sursa mediului folosit de PM2.
5. Există spațiu suficient pentru două copii ale datelor și backupul este stocat în afara checkout-ului.

## Faza 1 — inventar numai în citire

Înainte de orice copiere se notează, fără a afișa conținutul fișierelor în logurile CI:

- dimensiunea, proprietarul și permisiunile pentru `content/site-content.json` și `content/cms-data.json`;
- numărul și dimensiunea totală a fișierelor din `content/logs` și `public/uploads`;
- starea Git a fișierelor urmărite;
- versiunea curentă a aplicației și starea procesului PM2;
- checksumurile fișierelor care vor fi copiate.

Inventarul se rulează din GitHub Actions prin workflow-ul manual
`Inventory production storage (read-only)`, numai din `main`. Solicitantul
introduce tokenul `INVENTORY`, apoi aprobatorul mediului `production` verifică
rularea înainte ca aceasta să primească acces la secretele SSH.

Înaintea primei conexiuni autentificate, workflow-ul compară cheia ED25519 a
serverului cu secretul de Environment
`PRODUCTION_INVENTORY_HOST_FINGERPRINT`. Dacă secretul lipsește, rularea se
oprește după afișarea amprentei observate, fără să scrie sau să folosească cheia
SSH. Amprenta trebuie verificată separat cu furnizorul serverului și apoi salvată
în Environment; o valoare observată din rețea nu este suficientă singură pentru
stabilirea identității serverului.

Toate cele patru valori folosite de inventar —
`PRODUCTION_INVENTORY_HOST`, `PRODUCTION_INVENTORY_USERNAME`,
`PRODUCTION_INVENTORY_SSH_KEY` și
`PRODUCTION_INVENTORY_HOST_FINGERPRINT` — trebuie create exclusiv ca secrete ale
Environment-ului `production`, nu ca secrete generale ale repository-ului sau
organizației. Rularea rămâne **NO-GO** cât timp există în repository scope ori
organization scope orice cheie SSH sau credential de producție; acestea ar putea
fi referite de un workflow modificat pe altă ramură, în afara aprobării
Environment-ului. Secretele generale existente se mută în Environment și se
șterg din ambele scope-uri înainte de prima rulare.

Workflow-ul transmite în memorie scriptul versionat
`scripts/report-production-storage.mjs` și nu execută nicio mutație intenționată
a aplicației, datelor, configurației, repository-ului ori proceselor. Clientul
SSH standard al runnerului este folosit direct, fără o acțiune SSH terță, iar
cheia temporară de pe runner are permisiuni restrictive și este ștearsă automat.
Clientul PM2 nu este pornit; starea proceselor este citită pasiv din PID-urile
existente și din `/proc`. Ca orice sesiune SSH și orice citire de fișier pe un
server live, operația poate totuși produce loguri de sistem sau actualizări
`atime`; o garanție fizică de zero scrieri ar necesita un snapshot montat
read-only.

Raportul nu afișează conținutul fișierelor JSON sau al logurilor, numele
fișierelor din directoarele de loguri/uploaduri ori mediul brut al procesului.
Deoarece repository-ul este public, nici metadatele operaționale nu sunt lăsate
în logurile Actions: raportul este criptat pe server pentru certificatul public
`ops/production-inventory-recipient.pem`, iar cheia privată rămâne local, în
afara repository-ului. În log apare numai textul criptat.

Înaintea primei rulări se confirmă local că certificatul și cheia privată au
aceeași cheie publică. Cele două comenzi de mai jos trebuie să producă același
hash, fără ca cheia privată să fie copiată în repository:

```bash
export DIGITALDOT_INVENTORY_PRIVATE_KEY=/calea-securizată/production-inventory-private-key.pem
openssl x509 -in ops/production-inventory-recipient.pem -pubkey -noout \
  | openssl pkey -pubin -outform DER \
  | openssl dgst -sha256
openssl pkey -in "$DIGITALDOT_INVENTORY_PRIVATE_KEY" -pubout -outform DER \
  | openssl dgst -sha256
```

Valoarea de după `DIGITALDOT_INVENTORY_CMS_DER_BASE64=` se decriptează local,
nu într-un comentariu GitHub și nu într-un serviciu online:

```bash
export DIGITALDOT_INVENTORY_CMS_DER_BASE64='<valoarea din rularea Actions>'
printf '%s' "$DIGITALDOT_INVENTORY_CMS_DER_BASE64" \
  | openssl base64 -d -A \
  | openssl cms -decrypt -binary -inform DER \
      -recip ops/production-inventory-recipient.pem \
      -inkey "$DIGITALDOT_INVENTORY_PRIVATE_KEY"
```

Pentru directoare sunt calculate întâi numărul de fișiere, dimensiunea totală,
profilurile de permisiuni și o amprentă de metadate. Conținutul este hash-uit o
singură dată, cu prioritate redusă, numai sub limitele explicite de 10.000 de
fișiere și 256 MiB pentru fiecare arbore. Limitele sunt reverificate în timpul
citirii; dacă arborele crește între scanări, checksumul parțial este eliminat și
checksumul complet este amânat pentru fereastra de mentenanță. Stabilitatea
raportată pentru directoare privește metadatele, nu detectează o rescriere cu
aceeași dimensiune și nu este echivalentul unui snapshot atomic.

`HEAD`-ul checkout-ului și directorul de lucru al procesului nu dovedesc singure
ce SHA a produs buildul care rulează. Similar, `/proc` confirmă numai prezența
cheilor urmărite în mediul inițial al procesului, nu valorile, sursa dotenv sau
ordinea lor efectivă de precedență. Aceste limitări rămân explicite în raport.

Inventarul inițial nu confirmă încă spațiul și permisiunile viitoarei rădăcini
persistente sau ale destinației de backup. Acestea se verifică separat după
confirmarea exactă a celor două locații, fără a le crea în această fază.

În această fază nu se rulează `npm run check:storage -- --require-external`.
Preflight-ul verifică și dreptul de scriere prin fișiere-probă temporare, deci
aparține fazei 3, după backup și copiere.

Dacă datele live diferă de repository, copia live are prioritate pentru backup și migrare. Nu se presupune că GitHub conține ultima salvare făcută din dashboard.

## Faza 2 — backup și înghețarea scrierilor

1. Se creează un backup cu timestamp, în afara checkout-ului.
2. Backupul include cele două fișiere JSON, întregul director de loguri și întregul director de uploaduri.
3. Deoarece logurile conțin date personale, backupul trebuie protejat și accesibil numai persoanelor autorizate.
4. Se opresc temporar scrierile înainte de copia finală. Dacă nu există un mod read-only verificat, se oprește procesul pentru fereastra minimă necesară.
5. Se repetă inventarul și checksumurile după oprirea scrierilor.

Orice diferență neașteptată oprește procedura; nu se continuă automat.

## Faza 3 — copiere și validare

1. Se creează structura țintă cu proprietarul identic cu utilizatorul procesului PM2.
2. Se copiază datele păstrând structura de directoare.
3. Se validează checksumurile sursă/destinație și faptul că ambele fișiere sunt obiecte JSON valide.
4. Se rulează preflight-ul proiectului cu rădăcina externă configurată:

```bash
DIGITALDOT_DATA_ROOT=<calea-confirmată> npm run check:storage -- --require-external
```

Preflight-ul trebuie să confirme că fișierele există, directoarele sunt citibile și scriibile, rădăcina reală nu intră în checkout și vechiul `public/uploads` nu mai poate umbri fișierele persistente.

## Faza 4 — eliminarea conflictelor din checkout

Această fază începe numai după confirmarea backupului și a checksumurilor.

- Fișierele din vechiul `public/uploads` se elimină din checkout numai după ce fiecare copie persistentă a fost verificată. Un director vechi nevid ar putea fi servit de Next.js înaintea rutei persistente.
- Dacă `content/site-content.json` sau `content/cms-data.json` are modificări locale, acestea se readuc la versiunea Git numai după confirmarea separată că varianta live este copiată și verificată în storage și în backup.
- Nu se folosesc comenzi destructive generale și nu se curăță alte fișiere din checkout.

La final, verificarea Git pentru fișiere urmărite trebuie să fie curată.

## Faza 5 — aceeași configurare pentru build și PM2

`DIGITALDOT_DATA_ROOT` trebuie să provină din aceeași sursă controlată pentru:

- shell-ul în care se rulează `npm run build`;
- procesul PM2 care servește aplicația după restart.

Înainte de deploy se verifică valoarea efectivă în ambele contexte fără a imprima alte variabile sau secrete. Restartul PM2 trebuie să preia explicit mediul actualizat; un restart care păstrează mediul vechi nu este suficient.

## Faza 6 — deploy controlat și smoke test

Deploy-ul se face numai pentru SHA-ul aprobat. După restart se verifică, în această ordine:

1. homepage și o pagină de serviciu răspund normal;
2. `/panou-control` permite autentificarea;
3. o citire din dashboard reflectă conținutul persistent;
4. o modificare temporară, reversibilă, se salvează și supraviețuiește unui restart;
5. un upload de test este disponibil imediat la URL-ul `/uploads/...` și rămâne disponibil după restart;
6. formularul de contact și pagina de loguri funcționează;
7. checkout-ul Git rămâne curat după salvare și upload;
8. fișierele de test sunt eliminate controlat.

Site-ul se redeschide pentru scrieri numai după trecerea tuturor verificărilor.

## Rollback

Înainte de deploy trebuie stabilit SHA-ul anterior și trebuie păstrat backupul neschimbat. Dacă apare o eroare:

1. se opresc din nou scrierile;
2. se revine la procesul și SHA-ul anterior;
3. se restaurează configurația anterioară sau se repune copia verificată a datelor, fără suprascriere oarbă;
4. se verifică homepage, dashboard, formular și uploaduri;
5. se păstrează toate artefactele de diagnostic și backupurile până la analiza completă.

Rollbackul nu șterge rădăcina persistentă și nu rescrie backupul original.

## Stare de aprobare

Până când inventarul serverului, calea exactă, backupul și sursa comună de configurare build/PM2 sunt confirmate, schimbarea rămâne **NO-GO pentru producție**.
