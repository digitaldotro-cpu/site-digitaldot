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
