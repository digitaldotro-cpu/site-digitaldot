## Rezumat pentru review

<!-- Explică pe scurt, în limbaj obișnuit, ce se schimbă și de ce. -->

## Pagini și zone afectate

<!-- Listează URL-urile, componentele sau procesele afectate. Scrie „N/A” dacă nu se aplică. -->

- Fișiere sau zone:
- URL-uri sau fluxuri:
- Impact în producție:
- Necesită un deploy separat după merge: Da / Nu
- Modifică date persistente, secrete, Environment, workflow-uri sau serverul: Da / Nu

## Ce trebuie să verifice Marius

<!-- Păstrează numai punctele relevante și adaugă orice verificare specifică schimbării. -->

- [ ] Modificarea corespunde cerinței și nu include schimbări neașteptate.
- [ ] Textele, imaginile, linkurile și formularele afectate sunt corecte.
- [ ] Versiunea mobilă și cea desktop au fost verificate, dacă este cazul.
- [ ] SEO-ul vizibil, URL-urile și redirecturile afectate sunt corecte, dacă este cazul.
- [ ] Dovezile și rezultatele testelor de mai jos sunt suficiente pentru aprobare.

## Dovezi pentru review

<!-- Adaugă linkuri accesibile reviewerului. Nu include parole, chei, secrete sau date personale. -->

- Preview sau pagină locală verificată:
- Capturi înainte/după:
- Teste rulate și rezultate:
- GitHub Actions:

## Verificare webmaster — @ciurariumarius

<!--
GitHub Review este aprobarea formală. Câmpurile de mai jos leagă dovezile de
versiunea verificată; autorul le completează înainte de a solicita review-ul.
-->

- SHA exact propus pentru review:
- Mediu verificabil: local / CI / staging / altul
- URL-uri și fluxuri care trebuie verificate:
- Observații pentru webmaster:
- Link către GitHub Review după verificare:

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
- [ ] Orice commit adăugat după review va necesita o verificare actualizată.
- [ ] Toate conversațiile de review vor fi rezolvate înainte de merge.
- [ ] Aprobarea formală va corespunde ultimului SHA revizuibil.

## Separarea aprobărilor

- [ ] Aprobarea acestui PR confirmă numai că schimbarea poate fi integrată în `main`.
- [ ] Aprobarea acestui PR nu autorizează deploy-ul în producție.
- [ ] Orice deploy necesită o cerere separată pentru SHA-ul exact și aprobarea Environment-ului `production`.
