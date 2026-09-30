# Controlul cererilor și jurnalul operațiilor

Stare: **componentă locală testabilă, fără adaptor de producție**. Nu este un
gateway instalabil și nu autorizează publicarea. Bază de implementare:
`b6d9041ad810463654990afae339eac00d166835` (main aprobat, PR #11).

## Stare actuală — corecțiile review-ului, 30 septembrie

TR-01: `promote` citește ceasul după finalizarea observației read-only, imediat
înainte de autorizare și admitere, fără alt `await` între ele. API-ul primește
`clock: () => milliseconds`, implicit `Date.now`, nu un `now` numeric capturat
înaintea observației; vechiul argument numeric este refuzat. Ceasul trebuie să
fie sincron și să întoarcă un întreg sigur. Expirarea blochează admiterea; nu
întrerupe automat o operație deja admisă. 11 teste noi verifică acest contract.

TR-02: identitățile namespace-urilor host/snapshot/procese sunt obligatorii și
validate înaintea comparațiilor; 37 regresii noi. Profilul laboratorului rămâne
fix, fără colector sau adaptor nou. TR-03: workflow-ul de PR a primit numai
pasul `npm run test:deploy-control`, în același job și cu aceleași permisiuni.
Execuția efectivă GitHub Actions nu este verificată prin aceste teste locale.

Suita curentă: 524 teste (412 de bază + 112 de laborator), dintre care 48 noi.
109 teste de reguli sunt reluate într-un director temporar; nu sunt numărate
de două ori. Dovezi noi: `digitaldot-review-fixes-20260930/verification.json`,
în workspace-ul chatului. Rezultatele istorice nu se rescriu.

OP-01 rămâne deschis: workflow-ul existent `deploy.yml` are declanșator push pe
main și comenzi de build/restart prin SSH. Fișierul nu este modificat; activarea
remote și secretele nu sunt verificate. Un viitor merge NU este presupus inert.
Fără publicare, stage/commit/push/PR/merge, acces la server sau pornire Linux/UTM.

## Etapa anterioară — reguli portate în repository, 29 septembrie

`scripts/deploy-control/lab/` include regulile de jurnal, identitate și semnare,
cu logica istorică păstrată și importuri relative. 75 teste: 72 de reguli și trei
de portabilitate, inclusiv execuția separată a celor 72 într-un folder temporar.
Comanda generală include acum 476 teste (401 existente + 75 noi); comanda
`test:deploy-control:lab` rulează doar cele 75. Cele 23 teste istorice ale
executantului/colectorului Linux rămân separat; nu au fost portate ori înlocuite.
Nu s-a mutat executantul/instalatorul root, nu s-a conectat nimic la site,
nu s-a pornit Linux/UTM și nu s-a publicat. Profilul de identitate rămâne fix
pentru laborator, nu pentru serverul real. Dovezi noi:
`digitaldot-portable-rules-20260929/verification.json`, în workspace-ul chatului.
Urmează revizuirea schimbărilor locale înaintea unui eventual PR, fără efecte reale.

## Etapa anterioară — dosar administrativ Next/PM2 integrat, 29 septembrie

Pachetul nou `digitaldot-admin-closure-20260929` a trecut 2/2 probe Linux:
lanț v2 complet cu arhivare/recitire și confirmare întârziată refuzată după
așteptare reală. Jurnalul sintetic rămâne blocat; datele și copia intacte,
retry refuzat, fără restore/unlock/transfer de lease. Arhiva este numai istoric.
20/20 teste administrative, 37/37 identitate și 401/401 control; 21 hashuri
Mac/Linux verificate. Cele șapte rezultate și 23 hashuri R1 anterioare intacte.
VM oprită normal, UTM închis și procese absente verificate la 15:29:49 București.
Semnatari root de laborator, nu aprobări umane independente sau aviz de producție.
Raport: `digitaldot-admin-closure-2026-09-29.md`, în workspace-ul chatului.
Urmează consolidarea locală a pachetului pentru revizuire și a condițiilor
de integrare reală, fără publicare ori acces nou implicit.

## Etapa anterioară — revizuire și remediere R1

Revizuire administrativă finalizată ulterior la 29 septembrie:
`INTERVENTION_REVIEW_RUNBOOK.md` conține clasificarea, refuzurile și fișa
reutilizabilă. **R1 identificat în pachetul istoric, corectat ulterior în laborator:**
ultima verificare nu recitea jurnalul inițial înainte de start. Pachetul nou
`digitaldot-journal-boundary-20260929` a trecut 7/7 probe Linux: șase refuzuri
post-consumare/pre-start și o pornire/observație validă. 38/38 teste de legare a
jurnalului, 37/37 de identitate și 401/401 de control reluate; 23 hashuri identice.
Dovezile vechi intacte; VM/UTM oprite normal și verificate. Revizuirea documentară
anterioară a reluat separat 71/71 teste, fără Linux. Raportul corecției:
`digitaldot-journal-boundary-fix-2026-09-29.md`, în workspace-ul chatului.

## Verificare anterioară — 29 septembrie 2026, Next/PM2 + observator v2

Proba separată `digitaldot-next-observer-20260929` a trecut: executantul
dispare prin SIGTERM după pornire, Next/PM2 rămâne aceeași instanță,
observatorul separat semnează identitatea verificată, iar retry-ul este refuzat.
Șase afirmații semnate contradictorii și observația după stop au fost refuzate.
Lanțul are trei confirmări, necesită revizuire administrativă și nu acordă
drept de execuție, transfer de lease, restore sau deblocare. Jurnal nou sintetic
blocked/thaw-intent, date ulterioare păstrate; jurnalele reale nu au fost accesate.

37/37 teste de identitate și suita completă 401/401 reluate; 16 hashuri
Mac/Linux identice, surse/artefacte neschimbate, log de erori gol.
VM oprită normal, UTM închis și procesele absente verificate.
Codul principal de control nu s-a modificat în această etapă; pachetul rămâne
de laborator. Urmează revizuirea finală a pachetului/procedurii administrative,
nu publicarea automată. Raport: `digitaldot-next-observer-2026-09-29.md`
în workspace-ul chatului. Numerele de teste din secțiunile istorice de mai jos
corespund etapelor respective, nu totalului actual.

## Ce este implementat

- `scripts/deploy-control/protocol.mjs`: validarea strictă a cererii, planului
  aprobat și metadatelor furnizate de viitorul adaptor de încredere.
- `scripts/deploy-control/journal.mjs`: blocare unică între procese, jurnal
  sincronizat pe disc și deduplicare după identitatea completă a operației.
- `scripts/deploy-control/admission.mjs`: leagă validarea de înregistrarea
  operației; cererile invalide nu creează lock sau jurnal de operație.
- `scripts/deploy-control/inspect.mjs`: comandă exclusiv de citire a stării;
  nu inițializează, nu recuperează și nu rulează o operație.
- `scripts/deploy-control/promotion.mjs`: leagă fazele jurnalului de efectele și
  verificările unui adaptor. Finalizează promovarea reușită; un health explicit
  negativ înainte de redeschidere declanșează revenirea verificată. La rezultat
  incert păstrează blocarea pentru inspecție, fără rollback automat.
- `scripts/deploy-control/recovery.mjs`: revenire înainte de redeschidere și
  finalizare după redeschidere, exclusiv cu lease-ul original și efecte
  serializate. Nu descoperă credențiale de ownership și nu preia lockuri.
- `scripts/deploy-control/lab-gate.mjs`: punct HTTP de acces numai pentru
  laborator, inițial închis, cu suspendarea cererilor și așteptarea celor active.
  Nu este o barieră OS împotriva accesului direct la backend sau la filesystem.
- `scripts/deploy-control/recovery-review.mjs` și CLI-ul
  `review-lost-supervisor.mjs`: inspecție exclusiv de citire după pierderea
  supraveghetorului/lease-ului. Nu autorizează recuperarea și nu citește tokenul
  din lock pentru a prelua operația. Starea live rămâne explicit neverificată.
- `scripts/deploy-control/submission-status.mjs`: consultarea aceleiași cereri
  după reconectare, legată de ID și hashul planului complet. Nu inițiază
  executarea și nu confundă rezultatul istoric cu sănătatea site-ului.
- 184 teste cu fișiere private temporare, procese Node și HTTP loopback.
  Testele unitare nu accesează PM2, SSH, configurația sau datele de producție.

```sh
npm run test:deploy-control
```

Modulele folosesc numai bibliotecile Node; nu cer instalarea dependențelor web
sau un build. Versiunea Node reală de test se înregistrează în raportul probei.
`v24.21.0` din plan este runtime-ul candidatului aplicației, nu o afirmație
despre runtime-ul cu care este executat acest set de teste.

## Relația cu propunerea PR #6

Comanda de pe transport rămâne exact `deploy <40 hex lowercase>`. Refuzăm spații
suplimentare, newline final, caractere de control, stdin nevid și argumente
suplimentare. Nu există `eval`, shell sau comandă executabilă aleasă de client.

ID-ul operației și celelalte câmpuri **nu vin din SSH_ORIGINAL_COMMAND**.
Viitorul gateway le va încărca dintr-un plan aprobat separat, controlat de
administrator, cu proveniență și expirare verificate. Bibliotecile de aici
validează forma și coerența, **nu autenticitatea observațiilor/planului**.
Un JSON fabricat nu este o dovadă de build, backup, health sau aprobare.

Planul v1 are exact aceste câmpuri:

| Câmp | Condiție |
|---|---|
| version, stage | `1`, `promote-node24` |
| operationId | 32 cifre hex lowercase, nou pentru un plan nou |
| targetSha, expectedCurrentSha | două commituri complete distincte |
| nodeVersion | exact `v24.21.0`, candidatul testat; nu generic „24” |
| artifactDigest | SHA-256 al artefactului construit separat |
| storageId | identitatea stocării externe, nu checksumul conținutului ei |
| configDigest | identitatea configurației controlate build/runtime |
| snapshotDigest | identitatea backupului consistent și validat al operației |
| issuedAt, expiresAt | milisecunde Unix, fereastră de cel mult 30 minute |

Perioada de 30 minute este limita acestei propuneri locale pentru admiterea
unei cereri, nu un timeout de oprire a site-ului și nu un cron. Expirarea după
admitere nu trebuie să oprească arbitrar o operație în desfășurare; adaptorul va
revalida condițiile înainte de mutații. Planurile expirate/viitoare sunt refuzate
la admitere și nu se prelungesc automat.

Observațiile de încredere trebuie să confirme main curent, release activ,
istoric înainte (nu downgrade/divergență), stocare deja externă și toate cele
patru identități plus Node exact. `authorizePromotion` este obligatoriu înainte
de `begin`; `begin` singur nu este o funcție de autorizare.

**Prima tranziție legacy este exclusă.** Modulul refuză bootstrap, Node 22 și
stocarea legacy. Tranziția inițială, compatibilitatea datelor cu vechiul cod și
revenirea la checkoutul live `b9bab27…` vor avea un control administrativ
separat; nu se relaxează acest contract ca să le permită implicit. Probe locale
cu vechea revizie `892d9dc…` nu dovedesc revenirea la `b9bab27…`.

## Jurnal, concurență și întreruperi

`initializeStore` creează numai un director nou, privat și canonic. Inițializarea
întreruptă sau un director existent nu se suprascriu. Root/records/lock au 0700;
fișierele au 0600 și un singur hard link. Symlinkuri, proprietari/permisii
neașteptate, fișiere >64 KiB, intrări necunoscute și istorice invalide sunt
refuzate. Există limite de 40 evenimente/operație și 10.000 înregistrări.

Un singur `active.lock`, creat exclusiv prin mkdir, acoperă toate operațiile
acestui controller. Backupul/migrarea/publicarea/revenirea viitoare trebuie să
coopereze cu **același controller**, nu să creeze lockuri independente.
Biblioteca nu oprește alte programe care ignoră acest protocol.

Fiecare înregistrare este sincronizată înainte de rename, apoi directorul este
sincronizat. Lockul este eliberat numai după o stare terminală validă; nu există
furt de lock după timeout, PID mort sau proces închis. O eroare după dobândirea
lockului păstrează o barieră care necesită verificare, chiar dacă efectele ar fi
putut fi doar parțiale. Nu se șterg automat dovezi incomplete.

Succesiunea normală:

`admitted → freeze-intent → frozen → snapshot-verified → stop-intent → stopped
→ activate-intent → activated → start-intent → started → health-verified
→ thaw-intent → thawed → completed → release lock`

O revenire după o posibilă oprire și **înainte de orice încercare de redeschidere
a scrierilor** are propria succesiune: intenție/confirmare de oprire candidat,
selectare și pornire release anterior, health verificat, intenție/confirmare
redeschidere scrieri, `rolled-back`, apoi unlock. Jurnalul nu restaurează date.

Fazele nu execută și nu dovedesc singure efectele. Adaptorul trebuie să scrie
intenția înainte de efect și confirmarea numai după verificarea efectului real.
De exemplu, `health-verified` cere SHA/runtime/storage/config/proces reale, nu
un HTTP 200 sau simpla înregistrare a textului în jurnal.

Inspecția raportează `blocked` dacă există o operație neterminată sau un lock.
Aceasta poate fi o operație încă în curs, nu neapărat o eroare: inspecția
filesystemului nu declară procesul mort și nu recomandă oprirea lui.

După `thaw-intent`, rollbackul automat este refuzat: pot exista scrieri noi.
Orice incertitudine poate deveni `manual-intervention`; aceasta nu se deblochează
prin API și nu înseamnă că site-ul funcționează sau că scrierile sunt oprite.
`cancelled` este permis numai din `admitted`, înaintea efectelor.

Repetarea aceluiași ID și plan terminal întoarce **doar rezultat istoric**.
Nu repornește procese, nu compară datele actuale cu un backup vechi și nu emite
`DIGITALDOT_DEPLOY_RESULT=SUCCESS`. Viitorul gateway va revalida independent
starea live înainte de orice confirmare curentă. Un ID reutilizat cu alt plan
este refuzat și păstrat pentru inspecție.

## Probe și limite de siguranță

Testele pornesc procese independente și le fac să iasă intenționat la fiecare
fază; un proces nou vede blocarea și refuză continuarea. Sunt acoperite și
finalizarea înainte de unlock, opt concurenți, record orfan, lock gol, fișier
temporar neterminat, lease alterat, plan înlocuit, hash/Node/istoric/stocare
greșite, symlink/hardlink și jurnal corupt. Sunt injectate și erori de rename,
fsync după rename și fsync în timpul unlockului. După un rezultat incert,
același handle nu mai poate continua scrierile sau elibera lockul. Un fișier
temporar rămas blochează și un handle nou. Cleanupul șterge doar directoarele
temporare sintetice create de test, după încheierea proceselor proprii.

Acestea sunt probe de **întrerupere a procesului**, nu de cădere de tensiune,
defect fizic al discului, terminare PM2 în Linux sau întrerupere reală SSH.
Fsync și rename nu constituie singure o certificare de rezistență la power-loss.
Nu există protecție contra unui adversar cu același UID care poate modifica
arbitrar filesystemul. Planurile și codul vor necesita separare OS adecvată.

## Pachetul administrativ — condiții înainte de instalare

1. Programul controller/gateway și planurile aprobate sunt controlate de
   administrator, în afara release-urilor site-ului. Codul aplicației, npm și
   buildurile nu rulează cu privilegii de administrator/controller.
2. Identitatea care execută buildul/aplicația nu poate modifica codul
   controllerului, planurile aprobate, cheia forced-command sau jurnalul lui.
   Modelul exact de utilizatori/permisiuni și căile finale se aprobă separat.
3. Cheie de publicare dedicată, diferită de cea de inventar; comanda forțată
   și restricțiile SSH se testează cu un wrapper complet înainte de instalare.
   Acest director nu conține încă acel wrapper și nu trebuie instalat ca atare.
4. Adaptor Linux/PM2: build în release separat, verificare de artefact completă,
   proces/runtime exact, configurație controlată comună, excluderea tuturor
   scriitorilor și oprirea confirmată a proceselor proprii. Nicio deducție din
   simpla prezență a unui fișier sau din existența unui PID.
5. Prima migrare legacy, backupul nou și revenirea fără pierderea salvărilor
   se probează separat. Copia criptată a snapshotului din 8 septembrie nu este
   snapshotul final al unei intervenții noi.
6. Recuperarea după crash cere citirea dovezilor și reconciliere cu starea
   reală. Nu se recomandă ștergerea manuală oarbă a `active.lock`.
7. Workflow-ul vechi rămâne dezactivat. PR, merge, instalare, activare workflow
   și deploy pentru SHA exact sunt pași separați; această componentă nu face
   niciunul dintre ei. Nicio modificare a aprobărilor sau secretelor GitHub.

## Prima integrare Linux/PM2 — 23 septembrie 2026

Promovarea scurtă în laborator a trecut: versiunea de laborator `892d9dc…`
cu Node 22.22.2 a fost oprită normal, a fost selectat `b6d9041…`, apoi Next.js
a pornit prin PM2 cu Node 24.21.0. Identitățile proceselor, executabilele,
directorul, socketul loopback și configurația de test au fost verificate de
helperul PM2 existent. Jurnalul nou are toate cele 14 faze până la `completed`.
Datele fictive salvate înainte și uploadul au fost recitite intacte după.

Adaptorul exact și dovezile sunt în pachetul local
`outputs/digitaldot-deploy-basic-20260923` al taskului. Acesta are căi fixe
numai către `digitaldot-linux-lab`, un PM2_HOME nou și credențiale fictive.
`artifactDigest` reprezintă în această probă manifestul redus de build;
nu este atestarea completă a tuturor fișierelor de build/dependențe cerută
pentru un adaptor de producție. Istoricul a fost verificat prin Git local.

Punctul de acces al probei este `127.0.0.1:3401`, iar backendul Next este
`127.0.0.1:3400`. Suspendarea acoperă clienții probei care folosesc primul
port. Nu demonstrează excluderea tuturor scriitorilor unui server real.
Snapshotul sintetic a fost comparat integral, fără restaurare peste date.

Prima verificare finală a anticipat două ID-uri PM2 în numele logurilor;
PM2 a reutilizat ID 0. S-a corectat setul exact așteptat și verificarea a
trecut, fără repornirea aplicației. Eșecul inițial rămâne în dovezi.
Replay-ul istoric a fost verificat în proces înainte de oprire; checkpointul
detaliat al celor două PID-uri a fost adăugat în runner pentru probe viitoare.

128/128 teste au trecut pe Mac Node 24.19.0 și pe Linux Node 24.21.0.
PM2 și aplicația au fost oprite normal, apoi VM a fost confirmată `stopped`
și UTM închis. Nu este o validare a recuperării automate după crash.

## Recuperare supravegheată în Linux — 23 septembrie 2026

Cinci scenarii au trecut cu Next.js/PM2 reale și date exclusiv fictive:
health negativ injectat, întrerupere după oprire, după selectarea candidatului,
după pornirea candidatului și după redeschiderea accesului. Primele patru
revin la 892d9dc/Node 22.22.2, fără restaurarea datelor. Ultimul refuză
rollbackul și finalizează b6d9041/Node 24.21.0 păstrând salvările noi din
dashboard și uploadul făcut după redeschidere.

Supraveghetorul a primit lease-ul original prin IPC privat înainte de
întrerupere. A așteptat ieșirea exactă a procesului copil și terminarea
efectelor helperilor. Nu a citit owner.json pentru a obține un lease nou și
nu a șters lockul. Recuperarea după moartea supraveghetorului, pierderea
lease-ului, efecte încă în curs, întrerupere reală SSH sau power-loss nu este
acoperită. `stateForLease` este o citire validată a ownershipului existent,
nu o metodă de preluare a unei operații.

La `thaw-intent`/`thawed`, finalizarea suspendă din nou accesul de test și
verifică identitățile, procesul și datele curente. Nu cere ca datele curente
să coincidă cu snapshotul vechi; acesta rămâne intact. Un rezultat incert
păstrează bariera de intervenție manuală.

Prima încercare after-stop a detectat o eroare a adaptorului de laborator:
existența snapshotului era memorată înainte de crearea sa de către copil,
iar recuperarea încerca mkdir exclusiv pe directorul deja creat. S-a eliminat
acea stare memorată; verificarea recitește existența și siguranța directorului.
Încercarea eșuată a rămas blocată pentru audit, fără procese active. Reluarea
într-un director nou after-stop-r2 a trecut; nu s-a forțat deblocarea primei.

140/140 teste au trecut pe Mac Node 24.19.0 și Linux Node 24.21.0; lint trecut.
Cele 14 module testate în Linux au hashuri identice cu implementarea locală.
Replay-ul a păstrat PID-ul și identitatea de pornire; toate cele cinci probe
au verificat conținutul/uploadul, snapshotul și 622 fișiere sursă.
PM2 oprit normal, porturile libere, VM stopped și UTM închis/verificat.

Raportul și dovezile sunt în workspace-ul taskului:
`outputs/digitaldot-recovery-2026-09-23.md` și
`outputs/digitaldot-recovery-20260923/evidence/`.
Pasul următor este definirea autorității de recuperare după pierderea
supraveghetorului și verificarea întreruperilor reale de transport, apoi
separarea OS, acoperirea tuturor scriitorilor și wrapperul administrativ.
Nu este autorizată instalarea/publicarea în producție.

## Pierderea supraveghetorului și închiderea SSH — 28 septembrie 2026

Trei scenarii trecute: dispariția întregului deținător al lease-ului după
pornirea candidatului, după redeschidere și salvări noi, respectiv închiderea
clientului SSH de test. Niciun lease nu a fost transmis operatorului probelor.
Aplicația PM2 a supraviețuit; gateway-ul de laborator a dispărut cu proprietarul.
Inspecția independentă a păstrat jurnalul, datele curente și snapshotul;
o nouă admitere a fost refuzată. Nu s-a reluat publicarea și nu s-a restaurat
un backup. Oprirea finală PM2 este cleanup de laborator, nu recuperare live.

În cazul SSH, wrapperul de test reacționează la EOF numai după checkpointul
cu efecte terminate și închide exact copilul creat de el. Proba confirmă
închiderea clientului/conexiunii, nu pierderi de pachete, blackhole de rețea,
moartea sshd sau efecte încă în curs. Primul driver Mac a presupus greșit că
OpenSSH raportează neapărat signal=SIGTERM; de fapt poate trata semnalul și
ieși cu cod 255. Proba repetată separat a confirmat ambele capete. Prima
încercare este păstrată; verificarea și cleanupul guestului trecuseră și acolo.

162/162 teste pe Mac și Linux, lint trecut; 17 module identice prin hash.
Toate cele patru rulări guest au fost oprite normal; VM stopped, UTM închis
și procese absente. Cod local necomis, fără GitHub sau producție.
Raport: `outputs/digitaldot-supervisor-2026-09-28.md` în workspace-ul taskului.
Politica de recuperare propusă este în `LOST_SUPERVISOR_POLICY.md`.

## Executant independent de SSH — 28 septembrie 2026

Două probe cu Next/PM2 reale au trecut în pachetul de laborator
`outputs/digitaldot-detached-20260928`: închiderea clientului SSH după
admitere și trei cereri inițiale simultane. Executantul este un proces cu
sesiune Linux proprie, stdin/stdout/stderr decuplate și fără IPC către client.
El validează și admite cererea prin același jurnal; clientul nu primește lease.

După închiderea SSH, același PID/identitate a finalizat promovarea la
b6d9041/Node 24.21.0; părintele a devenit PID 1. Două repetări în timpul
operației nu au pornit procese noi. În proba simultană, trei procese au
încercat lansarea, dar un singur executant a fost admis; candidatul a pornit
o singură dată. După finalizare, trei repetări pentru fiecare probă au dat
numai rezultat istoric, cu PID/birth/date/jurnal neschimbate.

184/184 teste au trecut pe Mac Node 24.19.0 și Linux Node 24.21.0; lint trecut,
19 module identice prin hash. Date/upload intacte, 622 surse verificate și
17 directoare de date din laboratoarele anterioare neschimbate. Procesele
executant/client nu mai sunt active; PM2 oprit normal, VM stopped, UTM închis.

Este un executant one-shot cu căi fixe, numai de laborator. Nu sunt instalate
servicii systemd, utilizatori OS sau drepturi noi; nu există repornire automată,
wrapper de producție sau recuperare după moartea executantului. Fereastra de
8 secunde la checkpoint servește numai probelor de transport/concurență.
Poarta HTTP a testului este închisă la final; disponibilitatea permanentă prin
reverse proxy și izolarea tuturor scriitorilor rămân de implementat separat.
Raport: `outputs/digitaldot-detached-2026-09-28.md` în workspace-ul taskului.

**Următoarea implementare:** probe de eșec, întrerupere și reconciliere a
adaptorului real de laborator, cu păstrarea datelor salvate după redeschidere.
După acestea se poate finaliza wrapperul restrâns și pachetul administrativ.
