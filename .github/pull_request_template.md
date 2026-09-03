## Rezumat pentru review

<!-- Explică pe scurt, în limbaj obișnuit, ce se schimbă și de ce. -->

## Pagini și zone afectate

<!-- Listează URL-urile, componentele sau procesele afectate. Scrie „N/A” dacă nu se aplică. -->

- Fișiere sau zone:
- URL-uri sau fluxuri:
- Impact în producție:
- Necesită un deploy separat după merge: Da / Nu
- Modifică date persistente, secrete, Environment, workflow-uri sau serverul: Da / Nu

## Ce trebuie verificat înainte de aprobare

<!-- Păstrează numai punctele relevante și adaugă orice verificare specifică schimbării. -->

- [ ] Modificarea corespunde cerinței și nu include schimbări neașteptate.
- [ ] Textele, imaginile, linkurile și formularele afectate sunt corecte.
- [ ] Versiunea mobilă și cea desktop au fost verificate, dacă este cazul.
- [ ] SEO-ul vizibil, URL-urile și redirecturile afectate sunt corecte, dacă este cazul.
- [ ] Dovezile și rezultatele testelor de mai jos sunt suficiente pentru aprobare.

## Dovezi pentru review

<!-- Adaugă linkuri accesibile responsabilului de aprobare. Nu include parole, chei, secrete sau date personale. -->

- Preview sau pagină locală verificată:
- Capturi înainte/după:
- Teste rulate și rezultate:
- GitHub Actions:

## Responsabil de aprobare — @la-filip

<!--
@la-filip este responsabilul principal de aprobare. GitHub nu permite autorului
unui PR să își aprobe propriul PR. Dacă PR-ul este creat de @la-filip, aprobarea
formală nu este posibilă; decizia de integrare se confirmă separat înainte de
merge, folosind contul administrator digitaldotro-cpu. Pentru o aprobare formală
din partea lui @la-filip, PR-ul trebuie deschis de un alt cont.
-->

- SHA exact propus pentru verificare:
- Mediu verificabil: local / CI / staging / altul
- URL-uri și fluxuri care trebuie verificate:
- Observații pentru responsabilul de aprobare:
- Link către GitHub Review, dacă autorul și aprobatorul sunt conturi diferite:

## Riscuri și revenire

<!-- Descrie impactul posibil și cum se revine la versiunea anterioară. -->

- Risc:
- Plan de revenire:

## Checklist autor

- [ ] Schimbarea este izolată într-o ramură separată.
- [ ] Diff-ul conține numai modificările declarate în acest PR.
- [ ] Nu au fost introduse secrete, parole sau date personale în repository ori în loguri.
- [ ] Testele relevante au trecut sau excepțiile sunt explicate clar.
- [ ] Capturile ori preview-ul sunt incluse sau este explicat de ce nu se aplică.
- [ ] Orice commit adăugat după verificare va necesita o verificare actualizată.
- [ ] Toate conversațiile de review vor fi rezolvate înainte de merge.
- [ ] Aprobarea sau confirmarea de integrare corespunde ultimului SHA revizuibil.

## Separarea aprobărilor

- [ ] Aprobarea sau confirmarea acestui PR privește numai integrarea în main.
- [ ] Aprobarea acestui PR nu autorizează deploy-ul în producție.
- [ ] Orice deploy necesită o cerere separată pentru SHA-ul exact și aprobarea Environment-ului production.
