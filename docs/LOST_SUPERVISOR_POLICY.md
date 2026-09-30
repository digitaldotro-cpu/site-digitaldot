# Pierderea supraveghetorului — autoritate și limite

Stare la 28 septembrie 2026: politică propusă pentru implementarea următoare,
nu acces nou, autorizare de producție sau mecanism de recuperare instalat.

Procedura de lucru pentru revizuire, fără efecte asupra aplicației, este în
`INTERVENTION_REVIEW_RUNBOOK.md` (29 septembrie). Include R1, lipsa reverificării
jurnalului la frontiera pornirii în adaptorul Next/observator. Documentarea
nu acordă drept de preluare și nu reprezintă remedierea acestei lipse.

Remedierea R1 a fost realizată ulterior în `digitaldot-journal-boundary-20260929`:
jurnalul intră în observația fiecărei verificări pre-start; șase modificări injectate
au fost refuzate înainte de pornire, iar cazul valid a trecut, 7/7 în Linux.
Nu s-a citit tokenul pentru a prelua vreo operație; datele și probele vechi sunt
păstrate. Acest rezultat nu implementează transfer de lease sau unlock.

Actualizare 29 septembrie: proba `digitaldot-next-observer-20260929` a legat
observatorul v2 de Next/PM2 reale după oprirea executantului prin SIGTERM.
Aceeași instanță a fost recunoscută fără restart; repetarea aprobării consumate
a fost refuzată. Trei confirmări semnate, fără închidere administrativă.
Jurnalul nou sintetic rămâne blocat și datele curente intacte. Nu s-a citit
tokenul unui jurnal real și nu s-a acordat drept de execuție/restore/unlock.
Observatorul este root separat, nu autoritate independentă față de root.
37/37 teste noi de identitate, 401/401 teste de control reluate; VM/UTM oprite.
Raportul complet și limitele sunt în `digitaldot-next-observer-2026-09-29.md`
din workspace-ul chatului. Această probă nu schimbă regula de mai jos.

Actualizare ulterioară 29 septembrie: `digitaldot-admin-closure-20260929`
integrează într-un dosar nou patru confirmări și arhiva cu Next/PM2 reale.
2/2 probe trecute, inclusiv refuz administrativ după așteptare reală de 61 secunde.
Jurnalul rămâne blocat, datele păstrate; închiderea este numai administrativă.
Nu schimbă regula de preluare și nu completează retroactiv dosarul de mai sus.
Semnatar root de laborator, nu operator uman independent. 20/20 teste noi,
37/37 identitate, 401/401 control; VM/UTM oprite normal și verificate.
Raport: `digitaldot-admin-closure-2026-09-29.md`, în workspace-ul chatului.

## Regula implementată

Fără lease-ul original și exclusivitate demonstrată nu există reluare prin
API. PID mort, timeout, SSH deconectat, expirarea planului sau un jurnal
aparent complet nu sunt dovezi suficiente pentru preluare. Tokenul din
`active.lock/owner.json` nu este o sursă legitimă pentru un nou executant.
Jurnalul și datele rămân pe loc. Inspecția nu redeschide traficul.

CLI local exclusiv de citire:

```sh
node scripts/deploy-control/review-lost-supervisor.mjs /cale/canonica/jurnal-existent
```

Codul de ieșire 2 înseamnă inspecție administrativă necesară; 64 indică
argumente invalide. 0 înseamnă numai jurnal istoric fără barieră restantă,
nu site sănătos, drept de publicare sau permisiune de restore. Citirea nu
este un snapshot atomic al sistemului. Toate rezultatele păstrează
`automaticRecoveryAuthorized: false` și starea live neverificată.

## Separarea recomandată pentru continuare

Clientul SSH transmite cererea și poate consulta rezultatul. Nu trebuie să
dețină singur viața operației. Un executant local controlat administrativ
deține operația și jurnalul, separat de build/aplicație. Pierderea clientului
nu justifică o a doua operație. Dacă moare executantul însuși, se păstrează
bariera și se intră în procedura administrativă de mai jos.

Separarea duratei de viață a fost demonstrată ulterior pe 28 septembrie în
laborator: proces detached, sesiune proprie și descriptori decuplați; aceeași
operație s-a finalizat după închiderea SSH. Nu este încă un serviciu de
producție. Rolurile nu sunt atribuite unor utilizatori OS separați;
identitățile, drepturile și căile de producție necesită aprobare separată.

`submission-status.mjs` oferă numai o observație pentru clientul reconectat,
legată de ID și hashul întregului plan. Planurile cu același ID și alte date
sunt refuzate fără mutații. O observație `not-recorded` nu este permisiune
de execuție: executantul trebuie să revalideze și să dobândească exclusivitatea
atomic, deoarece mai mulți clienți pot vedea aceeași stare înainte de admitere.
`recorded-not-live-verified` nu dovedește că procesul încă trăiește, iar
`historical-result` nu înseamnă stare live sănătoasă.

## Condiții pentru o viitoare recuperare administrativă

1. Se exclude executantul original și orice efect delegat încă în curs.
   Dovada trebuie să acopere procesele descendente, helperii și RPC-urile,
   nu doar existența unui PID. Nu se semnalează procese cu identitate incertă.
2. Se suspendă și se drenează toate căile de scriere, printr-o barieră
   independentă a cărei exclusivitate poate fi verificată. Poarta HTTP a
   laboratorului nu îndeplinește această condiție pentru producție.
3. Se colectează identitățile reale: cod/build complet, runtime, configurație,
   proces/socket, stocare și starea curentă a datelor. Se păstrează dovezile
   și se creează un backup consistent nou atunci când se poate demonstra
   excluderea scriitorilor. Nu se înlocuiesc datele cu snapshotul vechi.
4. Se produce un plan nou de recuperare, legat de identitatea jurnalului,
   operația întreruptă, hashul dovezilor și starea observată. Planul specifică
   o singură acțiune și condițiile exacte de refuz; nu este un permis generic
   de unlock sau un boolean `approved: true` furnizat de client.
5. Operatorul autorizat verifică și aprobă separat acel plan. Un viitor
   controller trebuie să autentifice proveniența aprobării, să prevină
   reutilizarea ei și să păstreze o urmă durabilă a transferului autorității.
6. Abia după implementarea și testarea acestei proceduri se poate executa
   acțiunea aprobată, cu reverificarea exclusivității și a datelor. La orice
   incertitudine se păstrează blocarea și se raportează starea reală.

După orice posibilă redeschidere, datele curente au prioritate. Revenirea la
codul precedent cere compatibilitate dovedită cu aceste date; nu trebuie
confundată cu restaurarea unei copii vechi. Dacă nu se poate demonstra
compatibilitatea, continuarea sigură poate necesita intervenție manuală.

## Ce au demonstrat probele

### Confirmări legate și arhivă administrativă v2 (28 septembrie, etapa cea mai recentă)

Protocolul nou și arhiva separată sunt descrise în RECOVERY_RECEIPTS_V2.md.
Lanțul semnat leagă operația/aprobarea/încercarea de observația procesului și
de închiderea dosarului administrativ. 71 teste noi, 371/371 total pe Mac.
Arhivarea este exclusivă și refuză suprascrierea după întreruperi. Jurnalul
original rămâne blocat și nemodificat; nu există încă un adaptor de execuție
v2 sau transferul autorității. Cheile sunt numai efemere în teste. Linux/UTM
nu au fost pornite. Dovezile vechi v1 nu au fost rescrise ori semnate retroactiv.

### Reconcilierea istorică a intervenției de laborator (28 septembrie, etapa curentă)

`recovery-reconciliation.mjs` verifică exclusiv dovezi exportate de un colector
administrativ de încredere din brokerul sintetic v1. Este o funcție fără efecte:
nu citește lease-ul, nu pornește procese și nu scrie în jurnal. Cheia publică
este furnizată separat. Se verifică semnătura aprobării, identitatea stocului și
operației, hashul și succesiunea completă a jurnalului până la thaw-intent,
consumarea în intervalul autorizat și coerența înregistrărilor ulterioare.

Clasificarea distinge: absența consumării înregistrate; consumare fără intenție
de pornire; intenție cu efect incert; confirmare istorică fără verificare live;
dovezi nevalide. Absența unui fișier nu dovedește că un efect nu a existat.
O aprobare expirată poate explica un eveniment istoric, dar nu autorizează o
acțiune nouă. Niciun rezultat nu autorizează retry, unlock, restore, închiderea
jurnalului inițial sau transferul autorității. Blocarea inițială se păstrează.

Limită explicită: confirmarea finală v1 conține InvocationID, dar nu are propria
semnătură și nici legătura completă cu recoveryId/aprobare/operație. Coerența
unui pachet nu autentifică proveniența acestei confirmări; un InvocationID
plauzibil nu dovedește cauzalitatea sau sănătatea curentă. Înainte de închidere
administrativă este necesar un protocol nou, legat integral de intervenție și
de observații independente. Nu se completează retroactiv dovezile v1.

43 teste noi; suita completă 300/300 și lint trecute pe Mac. Cele șase pachete
reale R2 au fost colectate strict prin citire, în două treceri identice; toate
jurnalele rămân blocked/thaw-intent. Niciun serviciu de test nu a fost pornit.
Linux și UTM au fost oprite normal după colectare. Aceasta NU certifică starea
live a site-ului și NU implementează reconcilierea mutabilă de producție.

### Contractul de revizuire separată (28 septembrie, etapa ulterioară)

`recovery-proposal.mjs` adaugă un contract fără efecte și verificarea unei
semnături Ed25519. Nu este încă un mecanism de recuperare. Domeniul semnat
este `digitaldot/recovery-review/v1`, diferit de o comandă de execuție.

Planul canonic include identitatea stocului de jurnal, ID-ul operației și
al recuperării, hashul planului inițial, jurnalului și dovezilor, faza,
dovada declarată de excludere, cod/runtime/config/stocare și hashul datelor
curente. Copia proaspătă trebuie să aibă același digest de conținut ca datele
curente, nu digestul unui snapshot vechi. Formatul concret al manifestului
de date trebuie stabilit de viitorul colector; un digest de arhivă criptată
nu se compară direct cu un digest al datelor.

Scopul acceptat este exclusiv `review-only`; singura acțiune descrisă este
`retain-candidate-preserve-current-data`, din `thaw-intent` sau `thawed`.
Nu există acțiune unlock/restore și nici plan generic pentru toate fazele.
Dovezile declarate sunt de cel mult 60 de secunde la emitere, iar aprobarea
expiră în cel mult 5 minute. Aceste praguri sunt politica locală propusă,
nu dovadă de prospețime reală ori exclusivitate.

Cheia publică de încredere este furnizată separat de apelant, nu acceptată
din pachetul de aprobare. Testele generează chei efemere numai în memorie;
nu s-a instalat o cheie reală și nu s-a atribuit vreun rol unui operator.
Rezultatul validează semnătura, dar păstrează explicit:

- `executionAuthorized: false`;
- `liveStateVerified: false`, `writersExcluded: false`;
- `approvalConsumed: false`, `authorityTransferred: false`.

Verificarea se poate repeta: NU reprezintă protecție împotriva reutilizării.
Nu citește jurnalul, lease-ul sau datele, nu verifică identitatea efectivă a
proceselor și nu dovedește că metadatele corespund planului inițial real.
Un semnatar poate semna afirmații false; semnătura le leagă, nu le certifică.
Dovezile istorice ale probelor nu au fost transformate în aprobări curente.

Înainte de orice execuție rămân obligatorii colectarea live și verificarea
coerenței cu jurnalul/planul original, excluderea tuturor scriitorilor și
efectelor vechi, protejarea configurației de încredere, consumarea durabilă
a unei autorizări distincte de execuție și transferul atomic al autorității.
Nu există adaptor de producție sau CLI care să execute aceste propuneri.

### Probe Linux anterioare

- Deținătorul întregii operații poate dispărea, în timp ce Next/PM2 rămâne viu.
- Jurnalul blochează o nouă admitere; patru procese independente de inspecție
  pentru fiecare caz nu schimbă nimic și nu obțin lease-ul.
- Salvările și uploadul de după redeschidere rămân intacte.
- Oprirea clientului SSH declanșează EOF în wrapperul explicit al probei.
- Oprirea finală a proceselor proprii laboratorului se poate face normal,
  cu identități verificate, fără a debloca operația întreruptă.

Nu s-au demonstrat reluarea după pierderea lease-ului, disponibilitate
continuă, protecția contra altor scriitori cu același UID, power-loss sau
recuperarea unei intervenții asupra versiunii legacy din producție.
