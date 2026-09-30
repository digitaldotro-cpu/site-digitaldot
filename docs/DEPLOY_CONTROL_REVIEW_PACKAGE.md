# Digital Dot — pachet local pentru revizuire

Actualizat la 30 septembrie 2026. **Corectat local după review, nu pentru instalare în producție.**
Acest document consolidează rezultatele; nu autorizează commit, push, PR, merge,
schimbări de acces, restart, restore sau publicare. Nu modifică site-ul ori dashboardul.

## 1. Baza exactă și conținutul propus

Checkout: `site-digitaldot-deploy-control`, branch `codex/deploy-control-durable-2026-09-23`.
Bază locală: `b6d9041ad810463654990afae339eac00d166835`, merge PR #11.
Nu s-a consultat GitHub în această etapă; aceasta NU confirmă HEAD-ul remote actual.
Fișierele sunt încă modificări locale, necomise. Nu se folosește „add tot”.

| Grup | Conținut pentru revizuire | Limită |
| --- | --- | --- |
| Contract și stare | `protocol`, `admission`, `journal`, `submission-status`, `inspect` | Validarea metadatelor nu autentifică sursa lor; inspecția nu acordă execuție |
| Orchestrare | `promotion`, `recovery`, `execution-boundary` | Poate chema efecte prin adaptorul furnizat; nu este cod exclusiv de citire |
| Revizuire după întrerupere | `recovery-review`, `review-lost-supervisor`, `recovery-proposal`, `recovery-reconciliation` | Fără preluare a operației; reconcilierea v1 rămâne istorică |
| Confirmări și arhivă | `recovery-receipts`, `recovery-receipt-archive` | Verificare v2 și arhivă separată, fără unlock sau restore |
| Laborator portabil | `lab/`: reguli jurnal, identitate, semnare și teste; separat `lab-gate` și fixture-uri | Snapshoturi furnizate de apelant; poarta HTTP nu este barieră OS împotriva accesului direct |
| Documentație | Stare, politică, protocol v2, runbook și acest index | Cronologia păstrează explicit rezultatele și limitele etapelor vechi |
| Intrări de test | `test:deploy-control` (524 teste), `test:deploy-control:lab` (112 teste) și un pas nou în workflow-ul existent de PR | Fără dependențe, secrete sau configurare de deploy adăugate; execuția remote nu este verificată |

Extensia modulelor de mai sus este `.mjs`. Manifestul local enumeră fiecare
fișier cu dimensiune și SHA-256. Niciun import al componentei nu a fost găsit
în `app`, `lib`, `components` sau configurația Next la verificarea din 29 septembrie.
Workflow-ul de PR cheamă acum suita de teste, nu operații reale de deploy.
Componenta nu este conectată la site sau la publicare.

## 2. Ce NU intră în primul pachet de cod

- Instalatoare root, unități systemd, conturi/UID-uri și căi fixe de laborator.
- Chei, medii de configurare, parole, cookie-uri, tokenuri de ownership sau backupuri.
- `node_modules`, builduri, imagini VM și jurnale brute ale aplicației.
- Întregul folder de rezultate `outputs/`, prin copiere în masă.
- Modificări de deploy, colaboratori, reguli de aprobare sau secrete. Singura
  excepție pentru workflow-uri este pasul de test TR-03 din validarea PR-urilor.

Adaptorul Linux, executantul și colectorul rămân exclusiv în pachetele istorice.
Regulile `journal-binding.mjs`, `identity.mjs`, `admin-conclusion.mjs` au fost
portate ulterior în `scripts/deploy-control/lab/`, inițial cu logică neschimbată
și importuri relative. Corecția TR-02 întărește ulterior verificarea namespace-urilor;
istoricul nu este modificat. Acum există 109 teste de reguli și trei de
portabilitate, inclusiv rulare relocată. Cele 23 teste istorice
legate de sursa executantului Linux rămân acolo, nu sunt redenumite portabile.
Profilul de identitate este încă cel fix al laboratorului; portabilitatea nu
transformă remedierea R1 într-un adaptor de producție. Vezi `lab/README.md`.

## 3. Dovezile care susțin revizuirea

Pachetele se găsesc în `outputs/` al workspace-ului chatului, separat de checkout.
Snapshotul anterior este în `digitaldot-review-package-20260929/audit-result.json`.
Acesta este istoric: package.json și acest document au evoluat prin portare.
Verificarea portării este în `digitaldot-portable-rules-20260929/verification.json`.
Verificarea curentă a corecțiilor este în `digitaldot-review-fixes-20260930/verification.json`.
TR-01 citește ceasul după observație, înainte de admitere, și înlocuiește vechiul
argument numeric `now` cu un callback sincron `clock`. TR-02 refuză namespace-uri
lipsă/malformate; TR-03 adaugă suita în workflow-ul de PR, verificat numai local.

| Pachet istoric | Ce a verificat | Ce nu afirmă |
| --- | --- | --- |
| `digitaldot-next-pm2-20260929-r4` | 4 scenarii: pornire unică, salvări HTTP și restart cu date păstrate, refuz expirare/date schimbate | Nu emite lanțul v2 complet |
| `digitaldot-next-observer-20260929` | Pierderea executantului după start, observație semnată a aceleiași instanțe, refuzuri contradictorii | 3 confirmări; R1 exista în acest adaptor istoric |
| `digitaldot-journal-boundary-20260929` | 7 cazuri: 6 schimbări de jurnal refuzate înainte de start și un caz valid | R1 corectat numai în noul adaptor de laborator |
| `digitaldot-admin-closure-20260929` | 2 cazuri: dosar complet arhivat și confirmare tardivă refuzată după așteptare reală | Semnatar sintetic root, nu aprobare umană independentă |

Nu se însumează acestea ca scenarii unice ale aceluiași build: sunt pachete
distincte cu responsabilități diferite. Verificatorii offline recitesc dovezi
istorice; nu pornesc Linux și nu certifică starea actuală a unui server.
Hashurile detectează schimbări, nu autentifică singure proveniența.

## 4. Verificare repetabilă a pachetului

În checkout, cu Node 24 disponibil, `npm run test:deploy-control` rulează suita
componentei. Testele folosesc date temporare fictive, procese copil locale și
socketuri loopback; nu sunt teste pe serverul website-ului.

Utilitarul local `outputs/digitaldot-review-package-20260929/audit.mjs` verifică:
baza Git, modificarea restrânsă din package.json, sintaxa, suita componentei,
testele de jurnal/identitate/semnare, cei patru verificatori istorici și identitatea
copiilor de module folosite de laborator față de codul curent. Emite JSON pe stdout;
nu instalează, nu pornește aplicația și nu scrie în Git. Folosește căile acestui
Mac: nu este încă un utilitar CI portabil. Inventariază numai fișiere selectate.
Scanarea pentru chei private PEM este limitată, nu audit complet de secrete/securitate.

Auditul anterior așteaptă comanda de test și structura de la consolidare; nu este
actualizat retroactiv și nu este un verificator al noii comenzi. Pentru versiunea
portată se folosesc cele două comenzi npm de mai sus. Pentru corecțiile curente,
`digitaldot-review-fixes-20260930/verify.mjs` reia suita, lintul, parsarea workflow-ului,
verificatorii istorici și compararea manifestului, fără Linux sau publicare.

Orice schimbare ulterioară a fișierelor invalidează amprenta snapshotului și cere
o verificare nouă; rezultatele vechi nu se editează pentru a reflecta noul cod.

## 5. Condițiile rămase înainte de mediul real

| Condiție | Stare | Criteriu de închidere |
| --- | --- | --- |
| Delimitarea codului și dovezilor | Consolidată local | Review pe manifestul exact; modificările necomise sunt vizibile |
| Teste portabile pentru noile reguli | Închisă local | 112 teste în `lab/`, inclusiv 109 reluate într-un folder relocat; probe vechi intacte |
| Corecțiile TR-01 / TR-02 / TR-03 | Implementate local | 48 regresii noi; pasul CI este pregătit, dar execuția GitHub Actions rămâne neverificată |
| OP-01: efectul unui merge în main | Deschisă | Workflow-ul preexistent de deploy pornește la push main; starea remote și consecințele se verifică separat înainte de merge |
| Topologia reală și adaptor restrâns | Deschisă | Căi, utilizatori, PM2, procese, listener, runtime și storage reconfirmate printr-un inventar separat autorizat; comenzi strict limitate |
| Excluderea tuturor scriitorilor și efectelor vechi | Deschisă | Barieră verificată pentru backend, CMS/upload, joburi și acces direct; PID absent nu este suficient |
| Date curente și copie consistentă | Deschisă pentru viitoarea intervenție | Copie proaspătă sub excluderea scrierilor, restaurare de probă în mediu separat; fără suprascrierea datelor ulterioare |
| Autoritate și chei reale | Deschisă | Operator și scop confirmate, ancoră de încredere separată, drepturi minime, plan de revocare; fără cheile efemere ale testelor |
| Publicare sau restart real | Neautorizate aici | Plan exact, impact/interval, condiții de oprire și acord separat; apoi verificare live după execuție |
| Preluare după pierderea autorității originale | Neimplementată | Rămâne blocată; procedură și autorizare distincte dacă va fi necesară, fără citirea tokenului pentru preluare |

Nu este obligatoriu să construim recuperare automată pentru a revizui biblioteca.
Pentru integrarea viitoare se recomandă păstrarea opririi sigure și a analizei
manuale la incertitudine, nu extinderea implicită a drepturilor de recuperare.

## 6. Ordinea recomandată, fără execuție implicită

1. **Acum:** verificarea finală a corecțiilor TR-01/02/03 și a limitelor OP-01.
2. **Portare locală finalizată:** regulile de jurnal, identitate și semnare sunt
   în `scripts/deploy-control/lab/`, cu importuri relative și teste. Executantul
   root și instalatorul nu au fost mutate. Fără conectare la site ori pornire VM.
3. **Numai după review și cerere de publicare:** pregătirea unui PR limitat la
   componente locale. Reconfirmarea remote-ului și a regulilor GitHub înainte de
   publicare; nu presupunem că setările istorice sunt încă identice. Nu autorizăm
   merge sau auto-deploy; OP-01 trebuie clarificat înainte de merge.
4. **Separat:** plan de integrare reală și inventar read-only autorizat, apoi
   adaptor restrâns și o fereastră de intervenție aprobată. Nu folosim rezultatele
   sintetice ca permisiune de publicare.

Nu se adaugă două aprobări sau Marius ca reviewer obligatoriu prin acest document.
Rolurile executor/observator/administrator sunt roluri tehnice, nu trei persoane.
Lucian decide intervenția; cine operează mediul real se confirmă distinct.

## 7. Listă scurtă pentru reviewer

- [ ] Baza, manifestul și scope-ul corespund fișierelor revizuite.
- [ ] Testele și refuzurile trec; nu sunt confundate cu teste noi Linux.
- [ ] Orchestrarea cu efecte este separată de inspecție/verificare istorică.
- [ ] Închiderea administrativă nu este numită succes de deploy ori unlock.
- [ ] Nu intră în pachet medii, credențiale, instalatoare root sau rezultate brute.
- [ ] Portarea locală este verificată; profilul fix de laborator și condițiile de producție rămân explicite.
- [ ] O eventuală publicare are scope și aprobare distincte; efectul automat al
  workflow-ului de deploy este clarificat separat înainte de merge.

Stare finală: **revizuire locală posibilă; publicare și producție neautorizate.**
