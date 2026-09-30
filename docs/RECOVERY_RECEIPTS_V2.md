# Confirmări administrative semnate — laborator v2

28 septembrie 2026. Implementare locală, testată pe Mac, nepublicată.
Nu este adaptor de execuție, transfer al lease-ului original sau procedură de producție.

Procedura curentă de revizuire este în `INTERVENTION_REVIEW_RUNBOOK.md`.
Revizuirea finală din 29 septembrie a identificat R1: adaptorul Next/observator
recitește jurnalul la admitere și la observație, dar nu în ultima verificare
înainte de start. Proba istorică rămâne validă în scenariul ei; integrarea nu
este aprobată pentru producție. R1 a fost corectat ulterior în pachetul nou
`digitaldot-journal-boundary-20260929`: șase refuzuri la schimbarea jurnalului
după consumare/pre-start și o pornire cu observație validă, 7/7 în Linux.
38/38 teste de legare a jurnalului, 37/37 de identitate, 401/401 de control,
23 hashuri verificate. Dovezile vechi intacte; VM/UTM oprite normal.
Integrarea administrativă ulterioară este consemnată mai jos; nicio deblocare.

## Actualizare — lanț complet Next/PM2 și arhivă, 29 septembrie

Pachet nou `digitaldot-admin-closure-20260929`: două probe trecute. Cazul valid
are patru confirmări cu semnatari separați, arhivă exclusivă și recitire istorică.
Cazul întârziat așteaptă real cel puțin 61 secunde de la observație, apoi
semnatarul refuză confirmarea și nu este creată o arhivă de încercare.
Lanț incomplet, duplicat, context diferit și semnătură alterată sunt refuzate.
Jurnal blocat și date/copii intacte; aceeași aplicație până la oprirea normală,
retry refuzat. Nicio autoritate de execuție, restore, unlock ori transfer de lease.
20/20 teste administrative, 37/37 de identitate, 401/401 de control; 21 hashuri
verificate. Dovezile R1 anterioare intacte; VM/UTM oprite și verificate.
Raport: `digitaldot-admin-closure-2026-09-29.md`, în workspace-ul chatului.
Semnătura administrativă este sintetică, nu aprobare umană. Cheile efemere și
procesele root separate nu sunt o ancoră de încredere independentă de root.

## Actualizare — Next/PM2 și pierderea executantului, 29 septembrie

Proba `digitaldot-next-observer-20260929` a integrat lanțul v2 cu Next 16.3.2
și PM2 6.0.14 embedded pe Node 24.21.0. Executantul a fost oprit prin SIGTERM
după start; un observator root separat a identificat aceeași instanță Next
fără restart. Repetarea aprobării consumate a fost refuzată. Șase afirmații
semnate dar contradictorii și observația după oprire au fost refuzate.

Au rămas trei confirmări, cu starea
`process-attested-administrative-review-required`, nu închidere administrativă.
Jurnalul nou de laborator rămâne blocked/thaw-intent; datele salvate ulterior
sunt păstrate, fără restore. Niciun jurnal/token real nu a fost accesat.
37/37 teste de identitate, 401/401 teste de control reluate, 16 hashuri identice
Mac/Linux și semnături verificate offline. Linux/UTM oprite normal și verificate.
Raport: `digitaldot-next-observer-2026-09-29.md`, în workspace-ul chatului.

Observatorul root nu este o autoritate umană independentă. Dovezile sunt
istorice, iar cheile publice colectate sunt de laborator, nu o ancoră de
încredere de producție. Nicio autoritate de execuție/deblocare nu este acordată.
Secțiunile de mai jos păstrează cronologia etapelor și limitele fiecăreia.

## Contract

`recovery-receipts.mjs` verifică un context canonic și un lanț de maximum patru
confirmări Ed25519. Contextul include identitatea stocului, operației, recuperării
și încercării, digestul aprobării și al planului/jurnalului original, bootul,
serviciul, codul, runtime-ul, unitatea de serviciu, digestul fișierelor care trebuie
păstrate și intervalul de timp (maximum cinci minute).

Contextul este furnizat de apelantul de încredere, nu extras din confirmări ca
sursă de autoritate. Digestul aprobării leagă contextul de aprobare; modulul nu
verifică însă aprobarea originală și nu colectează identitățile live. Acestea
rămân sarcina adaptorului viitor, înaintea oricărei acțiuni.

Fiecare confirmare semnează domeniul distinct v2, digestul contextului, secvența,
faza, digestul întregii confirmări precedente (inclusiv semnătura), timpul și
conținutul canonic. Cheile publice de încredere sunt furnizate separat, niciodată
acceptate din pachetul de dovezi. Nu există funcție de semnare în modulul de
producere a octeților/verificare; testele semnează cu chei efemere în memorie.

| Secvență | Semnatar tehnic | Conținut și sens |
|---|---|---|
| 0 consumed | executor | Declarația consumării aprobării; nu o implementează |
| 1 start-intent | executor | Intenție pentru serviciul exact; efectul rămâne incert |
| 2 process-observed | observer | Încercare, boot, serviciu, InvocationID, PID, startTicks, stare active și fișiere păstrate |
| 3 administratively-concluded | administrator | Leagă exact confirmarea observatorului și închide doar dosarul administrativ |

Cele trei chei trebuie să fie publice, Ed25519 și distincte. Distincția
criptografică nu dovedește independența organizațională. Acestea sunt roluri
tehnice de laborator, nu trei persoane sau aprobări adăugate circuitului GitHub.
Nu s-au instalat chei reale și nu s-au creat utilizatori ori servicii noi.

Timpii trebuie să fie ordonați și în intervalul contextului. Închiderea trebuie
să fie în cel mult 60 de secunde de la observația semnată. Verificarea este
istorică: o confirmare veche poate rămâne validă ca istoric, fără a acorda
permisiunea unei execuții noi. PID singur nu este acceptat ca identitate completă.

Un lanț incomplet nu este completat automat: consumarea singură nu dovedește
absența efectelor; intenția fără observație rămâne incertă; observația fără
închidere rămâne pentru revizuire. Semnăturile autentifică afirmațiile, nu
adevărul lor, excluderea altor scriitori sau sănătatea aplicației.

## Arhiva durabilă separată

`recovery-receipt-archive.mjs` creează numai un stoc nou cu identitate și tip
propriu. Un OperationStore existent nu este o rădăcină acceptată. Pentru fiecare
attemptId, crearea exclusivă a directorului rezervă numele definitiv; pachetul
semnat și marcajul de commit sunt create exclusiv, cu fsync pe fișiere/directoare.
Inspecția verifică schema, digestul pachetului, contextul așteptat și semnăturile.

Nu se suprascrie și nu se șterge o rezervare, nici după întrerupere. O scriere
incertă este raportată ca atare. Un pachet vizibil complet după moartea procesului
poate fi citit ca istoric, dar aceasta nu demonstrează persistența după o pană
fizică de curent. Niciun rezultat de inspecție nu dă drept de retry/unlock.

Directoarele trebuie să fie canonice, private 0700 și deținute de utilizatorul
curent; fișierele 0600, obișnuite, fără hardlink, cu maximum 64 KiB. Se refuză
symlinkurile, structurile incomplete, câmpurile necunoscute și schimbările la
citire. Utilizatorul care deține stocul rămâne de încredere: arhiva nu este
protecție împotriva unui administrator care modifică intenționat toate dovezile.

## Ce NU se închide

Închiderea semnată privește exclusiv dosarul administrativ separat. Jurnalul
operației inițiale, blocarea sa și tokenul deținătorului nu sunt modificate.
API-urile păstrează false pentru executionAuthorized, retryAuthorized,
originalJournalClosureAuthorized, originalLeaseTransferred, unlockAuthorized,
liveStateVerified și dataRestorationAuthorized.

Înainte de folosirea reală rămân necesare: integrarea consumării durabile și
a efectului exact cu acest context, marcarea încercării în serviciul pornit,
observator independent al procesului/fișierelor, protejarea cheilor/configurației
și o procedură separată pentru jurnalul original. Nu se fabrică retroactiv
confirmări v2 pentru înregistrările v1. Nicio publicare automată nu este autorizată.

## Verificări realizate

50 teste de protocol și 21 de arhivare: context schimbat, semnături/roluri greșite,
lanțuri lipsă/reordonate, identități incoerente chiar cu semnături valide, timpi,
opt procese concurente, trei întreruperi reale de proces, cinci erori fsync
injectate și fișiere nesigure. Test cu OperationStore real de probă: jurnalul
rămâne blocked/thaw-intent și identic înainte/după arhivare.
Suita completă: 371/371; lint și diff-check trecute. Teste exclusiv pe Mac,
fără Linux, fără Next/PM2 real, fără test de pană de curent.

## Probă ulterioară: adaptor Linux cu procese reale

28 septembrie, 23:31: pachetul experimental separat digitaldot-live-vtwo a
trecut cinci scenarii Linux: concurență/pornire, întrerupere înainte și după
start, date modificate și semnătură greșită. Consumul aprobării se păstrează
durabil; replay-ul nu pornește o a doua instanță. Observatorul este un proces
root separat, cu cheie efemeră proprie; verifică systemd și /proc, attemptId
în argv, bootul, InvocationID, PID/startTicks, UID/cgroup, executabilul,
codul/configurația și fișierele păstrate. Șase afirmații semnate contradictorii
au fost refuzate la verificarea runtime. După crash post-start, numai observație
atestată și revizuire necesară, fără închidere administrativă automată.

21 teste locale pentru verificarea identității au trecut; 16 hashuri de cod și
unități identice Mac/Linux. Dovezile vechi R2 au rămas identice. Linux și UTM
au fost oprite normal, procesele absente verificate. Proba folosește aplicație
și date sintetice, nu Next/PM2. Observatorul nu este separat ca autoritate
de securitate față de root. Nu s-a eliberat blocarea jurnalului original.

La încheierea acelei probe rămânea de întărit ultima verificare înainte de efect:
expirarea/configurația schimbată între consumare și start. Acea probă a fost
păstrată nemodificată; verificarea suplimentară este documentată mai jos.

## Verificarea finală înainte de trimiterea comenzii de pornire

28 septembrie, 23:58: pachet separat `digitaldot-boundary-20260928`, nouă
scenarii Linux trecute. Modulul pur `execution-boundary.mjs` verifică schema
strictă, amprentele aprobării/contextului/consumării/confirmărilor, observația
jurnalului și a codului/configurației, datele, backupul și configurația lansării.
Valabilitatea este verificată cu maximul dintre timpul calendaristic și timpul
de admitere plus intervalul monotonic; revenirea ceasului înaintea admiterii,
datele invalide și expirarea inclusiv la limită sunt refuzate.

Adaptorul experimental verifică după consumare și după salvarea intenției.
Ultima citire a ceasului este după colectarea amprentelor; între verificarea
finală și apelul sincron către systemd nu există await, hook, log sau scriere.
Bariera de injecție este exclusiv pentru laborator și expiră fără pornire.

Au trecut: pornirea validă/concurența; expirarea după consumare și după intenție;
schimbarea configurației de lansare, unității systemd, aprobării, datelor,
backupului și marcajului consumării după intenție. În opt scenarii negative:
zero incrementări ale contorului, PID zero, fără comandă de pornire confirmată;
reutilizarea aprobării este refuzată. Modificarea nouă a datelor se păstrează.
Jurnalul original rămâne blocat/nemodificat. Intenția fără observație rămâne
`effect-uncertain` în protocol: proba separată de refuz nu fabrică o confirmare
semnată de anulare sau o autorizare de reluare.

30 teste noi, suita completă 401/401 și încă 21/21 pentru identificarea
procesului; 21 hashuri Mac/Linux identice. Cele cinci dovezi v2 anterioare
rămân identice, exceptând observația bootului curent după repornirea normală;
contextele istorice semnate NU sunt modificate. VM oprită normal, UTM închis,
procesele absente verificate. Dovezi în pachetul separat și raportul
`digitaldot-boundary-2026-09-28.md` din workspace-ul de lucru.

Limita este explicită: verificarea și pornirea systemd nu constituie o
tranzacție atomică. Nu se garantează că procesul începe înainte de expirare
dacă managerul de servicii întârzie comanda și nu există protecție împotriva
unui administrator root concurent ostil. Mediul/configurația și executorul
rămân de încredere. Nu este integrare Next/PM2, adaptor de producție sau aviz
de publicare; aceste rezultate nu eliberează blocarea operației originale.

## Integrare parțială ulterioară cu aplicația reală

29 septembrie: pachet separat `digitaldot-next-pm2-20260929-r4`, patru scenarii
trecute cu Next 16.3.2 și PM2 6.0.14 embedded, Node 24.21.0, cont dd-lab-app,
cgroup și rețea privată. Conținut/upload salvate prin HTTP și păstrate la
oprire/repornire; expirare și date schimbate post-intenție refuzate, la fel
reutilizarea aprobărilor. Patru planuri Ed25519 de laborator, verificarea
execution-boundary și 12 hashuri reverificate offline. VM/UTM oprite normal.

Proba folosește cereri administrative separate și observație kernel/systemd
de încredere. NU emite încă lanțul v2 de confirmări al observatorului pentru
Next/PM2 și NU închide un jurnal original; această legătură și întreruperea
executorului post-start rămân de integrat. Nu este topologia PM2 de producție,
test de sarcină sau autorizare de publicare. Încercările anterioare eșuate
sunt păstrate separat. Raport: `digitaldot-next-pm2-validat-2026-09-29.md`.
