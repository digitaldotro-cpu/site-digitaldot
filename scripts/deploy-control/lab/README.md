# Reguli portabile de laborator

Module fără acces la fișiere, rețea, procese sau servicii. Importul nu execută
operații. `admin-conclusion` semnează numai la apel, cu cheia furnizată în memorie
și ceasul injectat (implicit `Date.now`); nu salvează sau generează chei.
Nu există CLI, instalator, executant, colector Linux sau integrare cu site-ul.

## Contract și limite

- `journal-binding.mjs`: verifică legătura dintre plan, marker, record și rezultatul
  inspecției. Apelantul de încredere trebuie să furnizeze o inspecție OperationStore
  validată, proaspătă și încadrată de citiri identice. Nu este parser complet de
  jurnal ostil și nu demonstrează exclusivitate ori prospețime singur.
- `identity.mjs`: validează un snapshot deja colectat. Nu citește `/proc` și nu
  identifică singur aplicația live. Profilul rămâne cel al laboratorului:
  UID 999, Next 16.3.2, port 3400, două procese și cgroup/unitate specifice.
  Identitățile de rețea pentru host, snapshot și ambele procese sunt obligatorii,
  în formatul exact `net:[număr pozitiv]`, înaintea oricărei comparații.
  Portabilitatea înseamnă rularea validării/testelor oriunde cu Node 24, nu
  compatibilitate automată cu topologia reală a serverului.
- `admin-conclusion.mjs`: semnează doar un lanț v2 valid, în fereastra admisă.
  Apelantul este responsabil pentru cheile independente de încredere, ceasul
  real și observația live. Funcția nu acordă execuție, restore, retry sau unlock.

## Proveniență, fără rescrierea istoricului

Portare din `digitaldot-journal-boundary-20260929` (jurnal) și
`digitaldot-admin-closure-20260929` (identitate/semnare), 29 septembrie 2026.
La portare, logica era neschimbată și numai importurile erau adaptate.
La 30 septembrie, TR-02 întărește numai validatorul de identitate: datele de
namespace lipsă sau malformate sunt refuzate. Celelalte două module și toate
pachetele istorice din workspace-ul chatului rămân intacte.

109 teste de reguli: 15 de coerență jurnal, 74 identitate (37 inițiale + 37
regresii TR-02), 20 semnare.
Celelalte 23 teste istorice ale jurnalului verifică executantul/colectorul Linux
și surse istorice; NU sunt copiate ori prezentate drept teste portabile.
Trei verificări suplimentare acoperă dependențele, importul fără permisiuni de
efecte și rularea celor 109 teste într-un director temporar separat.
Rezultatele copilului relocat nu se adună încă o dată la numărul suitei principale.

Din rădăcina repository-ului, cu Node 24:

```sh
npm run test:deploy-control:lab
npm run test:deploy-control
```

Prima comandă rulează 112 teste. A doua include cele 412 de bază (401 inițiale
+ 11 regresii TR-01), pentru 524 în total. Testele componentei de bază pot
necesita socketuri loopback locale.
Nu este necesar Linux/UTM, npm install, build Next sau acces la server pentru
testele acestor module; sunt utilizate numai module standard Node.
