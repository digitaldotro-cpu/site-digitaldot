# Digital Dot — procedură de revizuire a unei intervenții

Versiune 1, 29 septembrie 2026. **Procedură de analiză și documentare, nu autorizare de execuție.**
Aplicabilă pachetelor de laborator existente. Adaptarea la producție este blocată
până la rezolvarea condițiilor din secțiunea 7. Nu există aici o comandă de deploy,
restart, restore, unlock sau preluare a unei operații.

Actualizare 29 septembrie, după revizuire: R1 a fost corectat și verificat în
pachetul nou `digitaldot-journal-boundary-20260929`: 7/7 scenarii Linux, 38/38
teste ale legăturii cu jurnalul, 37/37 de identitate și 401/401 de control.
Pachetul istoric nu s-a modificat. Celelalte condiții pentru producție rămân deschise.

## 1. Cele trei decizii care nu trebuie confundate

| Decizie | Ce poate afirma | Ce NU permite |
|---|---|---|
| Instanță observată | Un observator a identificat un anumit proces la un anumit moment | Nu garantează că trăiește acum; nu permite restart sau retry |
| Dosar administrativ încheiat | Lanțul de patru confirmări a fost verificat și, separat, arhivarea confirmată | Nu închide jurnalul operației inițiale și nu elimină blocarea |
| Acțiune nouă autorizată | Un mecanism distinct, verificat și aprobat permite exact acțiunea din plan | Nu rezultă dintr-o observație, din arhivă sau din aprobarea unui PR |

În implementarea v2 actuală, toate rezultatele păstrează false pentru execuție,
reluare, deblocare, transfer de lease, restaurarea datelor și validare live.
Un rezultat pozitiv al verificatorului este o verificare istorică.

## 2. Responsabilități, fără aprobări suplimentare inventate

- **Lucian:** decide obiectivul și autorizează separat o intervenție cu efecte,
  după prezentarea planului, riscurilor, datelor protejate și condițiilor de oprire.
- **Operatorul tehnic:** colectează numai dovezile permise și pregătește planul.
  Persoana și accesul pentru producție trebuie confirmate înaintea unei intervenții.
  Faptul că Marius este webmaster nu înseamnă că aprobarea lui este cerută automat.
- **Executant / observator / administrator:** sunt roluri criptografice ale
  protocolului, nu trei persoane obligatorii și nici trei review-uri GitHub.
  Rolurile tehnice distincte din test nu demonstrează independență față de root.

Nu modificăm colaboratori, drepturi, chei ori cerințe GitHub prin această procedură.
Cheile efemere și conturile cu căi/UID fixe ale laboratorului nu se instalează în producție.

## 3. Primul răspuns la o întrerupere

1. Se notează incidentul, ora cu fus orar, mediul și ultima acțiune cunoscută.
2. Se opresc încercările de reluare din partea operatorului; nu se deduce că aplicația
   este oprită din simpla dispariție a SSH-ului sau executantului.
3. Se păstrează jurnalul, blocarea, datele curente și dovezile existente.
4. Se colectează exclusiv informațiile permise prin procedura de inspecție deja
   autorizată. Nu se citește tokenul de ownership pentru a prelua operația.
5. Dacă identificarea unui proces, calea sau permisiunea sunt neclare, se oprește
   intervenția și se solicită clarificarea punctuală. Nu se semnalează un PID incert.

În producție, chiar și înghețarea scrierilor, oprirea sau pornirea aplicației sunt
acțiuni cu efecte și necesită plan și autoritate distincte. Închiderea normală a VM
după un test autorizat este cleanup de laborator, nu model de recuperare live.

## 4. Pachetul minim de revizuire

Dosarul se creează separat; nu se suprascriu probele sau încercările nereușite.

- **Identificare:** mediu, operație, încercare, aprobarea aferentă, cod/build, runtime,
  identitatea stocului și digestul jurnalului. Lipsurile se marchează explicit.
- **Cronologie:** emitere, expirare, consumare, intenție, observație, eventuală
  închidere; orele originale nu se rescriu pentru a face lanțul valid.
- **Dovezi de execuție:** consumare și confirmări semnate, identități kernel/systemd,
  proces și socket, rezultat HTTP și limitele acelei verificări.
- **Date:** digestul datelor curente și al copiei proaspete, metoda de obținere,
  dacă au fost excluși scriitorii și ce anume este demonstrat versus presupus.
- **Încredere:** sursa autorizată a cheilor publice așteptate și a contextului.
  O cheie inclusă în același dosar nu devine automat de încredere.
- **Verificări:** rezultatul, versiunea și amprenta verificatorului, erori/refuzuri,
  fișiere lipsă și concluzia limitată pe care o susțin.
- **Încheierea probei:** oprire verificată, ce procese au rămas, ce nu s-a verificat.

Nu se includ parole, chei private, cookie-uri, variabile de mediu brute, tokenul
de ownership sau loguri integrale. Se păstrează numai câmpurile aprobate și necesare.
Un manifest de hashuri ajută la detectarea modificărilor; nu autentifică singur
autorul și nu înlocuiește o sursă separată de încredere.

## 5. Clasificarea dovezilor și acțiunea permisă

| Stare v2 | Interpretare | Acțiune în această procedură |
|---|---|---|
| `no-receipts` | Nu există confirmări în lanțul prezentat | Documentare; absența nu dovedește lipsa efectelor |
| `consumed-no-start-intent` | Consumare consemnată, fără intenție în lanț | Revizuire; nu se reutilizează aprobarea |
| `effect-uncertain` | Intenție consemnată, efect neconfirmat în lanț | Păstrarea blocării; observație separată dacă este autorizată |
| `process-attested-administrative-review-required` | Proces identificat istoric; dosar incomplet administrativ | Revizuire; nu se pornește o altă instanță |
| `administratively-concluded-historical-only` | Patru confirmări valide istoric | Verificarea separată a arhivei; nicio autoritate nouă |
| `invalid-receipts-manual-review-required` | Lanț/context/încredere nevalide | Oprire, conservarea dovezilor, analiză manuală |

Pentru arhivă, `historical-record-not-live-verified` confirmă numai dosarul
istoric citit. `unreadable-or-incomplete-manual-review-required` impune oprirea;
nu se șterge rezervarea și nu se încearcă suprascrierea ei.

O eroare la colectare ori semnare NU declanșează automat restart, restore sau rollback.

## 6. Închiderea administrativă: condiții și refuzuri

Această secțiune descrie verificările necesare, nu instalează un semnatar sau CLI.

1. Există contextul așteptat și cheia publică a fiecărui rol dintr-o sursă de
   încredere separată. Cele trei chei de rol sunt publice, Ed25519 și distincte.
2. Primele trei confirmări sunt valide, ordonate, fără goluri și legate de aceeași
   încercare. Nu se combină confirmări de la alte porniri, operații sau medii.
3. Administratorul verifică explicit ce a demonstrat observația și limitele ei.
4. A patra confirmare, dacă se produce legitim în fereastra admisă, leagă digestul
   exact al confirmării observatorului și dispoziția `administrative-record-complete-original-fence-retained`.
5. Toate momentele trebuie să fie în intervalul contextului, de maximum 300.000 ms;
   confirmarea administrativă trebuie să fie la cel mult 60.000 ms după observație.
   Verificatorul validează timpii declarați semnați, nu dovedește ora reală a semnării.
   Emitentul de încredere trebuie să folosească timpul real și să refuze emiterea tardivă.
6. Se arhivează numai un lanț deja complet, într-o arhivă nouă/separată conform
   contractului, apoi se recitește arhiva cu contextul și cheile așteptate.
7. Închiderea dosarului și păstrarea blocării operației inițiale se notează separat.

**După expirare nu se antedatează și nu se adaugă o confirmare retroactivă.**
Un lanț de trei confirmări rămas incomplet se păstrează ca atare, cu o notă de
revizuire distinctă. Un dosar complet emis legitim poate fi verificat și arhivat
ulterior ca istoric. O nouă acțiune necesită plan, observații și autorizare noi;
nu se pornește încă o dată aplicația doar pentru a obține un dosar complet.

Aplicare la proba din 29 septembrie: rămân trei confirmări și starea de revizuire.
Nu generăm a patra confirmare pentru acea rulare și nu schimbăm rezultatul istoric.

## 7. Ce blochează folosirea în producție

### R1 — lipsă identificată în pachetul istoric; corectată în pachetul nou

În pachetul `digitaldot-next-observer-20260929`, `executor.mjs` verifică
`evidence()` la admitere. Ulterior, `gate()` recitește `observation()`, care
include bootul, codul, unitatea și configurația, dar nu jurnalul operației.
O schimbare a jurnalului după admitere nu intră în acel digest final.
Observatorul poate refuza ulterior confirmarea, dar nu poate anula preventiv
o comandă de pornire deja trimisă.

**Criteriu de rezolvare:** un pachet nou, fără alterarea probelor vechi, trebuie
să compare identitatea stocului/operației, planul, digestul și faza jurnalului
la verificările post-consumare și pre-start. Testele trebuie să injecteze schimbări
ale jurnalului în ambele puncte, să obțină refuz înainte de dispatch, fără proces
nou, cu consumarea păstrată și datele curente intacte. Cazul nemodificat trebuie
să treacă. Ultima citire a ceasului rămâne după colectare, înainte de dispatch.

Aceasta a fost o lipsă identificată la revizuire, nu un eșec al scenariului Linux
deja rulat cu jurnal neschimbat. Procedura nu o repară singură; implementarea nouă
din `digitaldot-journal-boundary-20260929` a îndeplinit ulterior criteriile de mai sus.
Colectorul leagă stocul/operația/planul/recordul/faza de inspecția proaspătă, cu
citiri comparate înainte și după inspecție. Observația folosită de fiecare gate
include această legătură. Au fost refuzate șase modificări injectate de stoc,
plan și fază, după consumare și pre-start; cazul nemodificat a pornit și a primit
confirmarea observatorului. Datele și consumarea au rămas păstrate.
R1 este închis pentru noul adaptor de laborator, nu ca garanție de producție.
Raport: `digitaldot-journal-boundary-fix-2026-09-29.md`, în workspace-ul chatului.

### Alte condiții, deja cunoscute, rămase deschise

- Barieră independentă pentru toate căile de scriere și dovada excluderii
  executantului/efectelor vechi; simpla lipsă a PID-ului nu este suficientă.
- Configurație și chei protejate pentru mediul real, operator autorizat și ancoră
  de încredere separată; nu se folosesc cheile efemere din dosare.
- Wrapper restrâns și adaptor pentru topologia reală PM2, căi și utilizatori
  validați; pachetele root cu valori fixe de laborator nu sunt instalatoare de producție.
- Copie consistentă nouă și procedură verificată de conservare a datelor curente;
  un hash egal într-un test nu demonstrează consistență sub scrieri concurente ori power-loss.
- Procedură separată pentru jurnalul inițial și transferul autorității, dacă vor
  fi implementate. În prezent nu există mecanism autorizat de preluare/unlock.

Integrarea Next/PM2 cu a patra confirmare și arhiva a fost demonstrată ulterior
în pachetul nou `digitaldot-admin-closure-20260929`, 2/2 probe: dosar complet
arhivat și confirmare întârziată refuzată după așteptare reală. Datele și jurnalul
blocant păstrate; fără retry, restore, unlock ori transfer de lease. 20/20 teste
administrative, 37/37 identitate și 401/401 control; dovezile R1 anterioare intacte.
VM/UTM oprite și verificate. Această condiție de laborator este închisă, fără
a închide celelalte condiții de mai sus sau a aproba producția. Semnatarii sunt
root de laborator, nu aprobări umane independente. Raport în workspace-ul chatului:
`digitaldot-admin-closure-2026-09-29.md`.

Verificarea finală și pornirea systemd nu sunt o tranzacție atomică și nu protejează
împotriva unui root ostil. Această limită trebuie să rămână explicită.

## 8. Fișă de revizuire reutilizabilă

Se completează într-un dosar nou. Un câmp necunoscut se marchează NECUNOSCUT,
nu se presupune valid. Această fișă nu este un payload semnat de execuție.

- Dosar / dată / fus orar:
- Operator / mediu / scop autorizat:
- Operație / încercare / aprobare / cod așteptat:
- Sursa independentă a contextului și cheilor publice:
- Ultima stare consemnată și ora observației:
- Confirmări prezente / lipsă și rezultat al verificării:
- Date curente / copie proaspătă / metoda de consistență:
- Scriitori și efecte vechi excluse: DA / NU / NECUNOSCUT; dovadă:
- Jurnal inițial și blocare păstrate; dovadă:
- Abateri / verificări neefectuate / limite:
- Decizie: NUMAI REVIZUIRE / DOSAR ISTORIC COMPLET / OPRIRE PENTRU CLARIFICARE:
- Acțiune suplimentară propusă, fără execuție implicită:
- Aprobarea exactă necesară pentru acea acțiune:
- Starea finală a proceselor / VM și dovezile opririi:

## 9. Surse și verificări ale acestei versiuni

- `RECOVERY_RECEIPTS_V2.md`, `LOST_SUPERVISOR_POLICY.md`, `DEPLOY_CONTROL_STATE.md`.
- `scripts/deploy-control/recovery-receipts.mjs` și `recovery-receipt-archive.mjs`.
- Pachetul istoric `outputs/digitaldot-next-observer-20260929/` din workspace-ul chatului.
- 71/71 teste de protocol/arhivare reluate pentru această revizuire.
- Verificatorul offline al pachetului istoric a trecut din nou: 16 hashuri,
  trei confirmări, șapte refuzuri, fără autoritate de execuție/deblocare.
- R1 confirmat prin citirea codului și evaluarea funcției reale `observation()`
  cu intrări fictive: jurnal schimbat → același digest; configurație schimbată →
  digest diferit. Diagnostic local, nu o probă Linux nouă.

Documentația este finalizată pentru revizuire. **Pachetul nu este aprobat pentru producție.**
