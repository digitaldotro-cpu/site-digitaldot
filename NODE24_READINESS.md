# Node.js 24 — starea pregătirii

Actualizat: 28 august 2026

## Decizie

Direcția rămâne **Node.js 24**, dar activarea în producție este momentan
**NO-GO**. Acest PR trebuie să rămână Draft și nu autorizează merge, instalare
pe server, restart PM2 sau deploy.

## Ce a trecut

Pentru candidatul Node.js `24.19.0` / npm `11.17.0` au trecut:

- instalarea curată a arborelui blocat în lockfile;
- verificarea exactă a versiunilor Node.js și npm;
- auditul npm complet și de producție, care a raportat zero advisories
  cunoscute la momentul rulării;
- lint și TypeScript;
- 11/11 teste pentru bariera de runtime;
- build-ul Next.js cu 99/99 pagini;
- cinci runde pe URL-urile prioritare și 77/77 URL-uri canonice din sitemap.

Dovada Linux independentă este
[rularea GitHub Actions 32831391933](https://github.com/digitaldotro-cpu/site-digitaldot/actions/runs/32831391933).

Aceasta confirmă compatibilitatea funcțională de bază pe SHA-ul testat. Nu
demonstrează stabilitatea după ore de trafic și nu validează serverul de
producție.

## Rezultatul testelor de două ore

### Proba inițială Node.js 24

[Rularea GitHub Actions 32838576616](https://github.com/digitaldotro-cpu/site-digitaldot/actions/runs/32838576616)
a testat exact commitul `da0c4acab424b4945c3913346d0ff0d32b440abe` sub
Node.js `24.19.0`. Rezultatul funcțional a fost bun: 28.714 cereri în 7.200 de
secunde, zero erori, 77/77 rute canonice acoperite și niciun eveniment OOM sau
crash.

Bariera RSS a eșuat însă cu `rss_trend_exceeded`. Procesul a pornit la
aproximativ 315 MiB RSS, a terminat la aproximativ 763 MiB și a atins
aproximativ 804 MiB. Pragurile nu au fost relaxate după rezultat.

### Comparația finală A/B

[Rularea GitHub Actions 33058856598](https://github.com/digitaldotro-cpu/site-digitaldot/actions/runs/33058856598)
a testat exact commitul `8d8496028d1c23b52aad82b14e12459351879b14` în
patru joburi independente. Node.js `22.22.2` și `24.19.0` au folosit npm
`11.17.0`, același lockfile, aceeași încărcare, aceeași durată și aceleași
praguri.

| Runtime | Repetarea 1 | Repetarea 2 |
| --- | --- | --- |
| Node.js `22.22.2` | **PASS** | **PASS** |
| Node.js `24.19.0` | **FAIL** | **FAIL** |

Fiecare job a procesat aproximativ 28.700 de cereri în 7.200 de secunde, cu
zero erori, acoperire 77/77, fără OOM, crash sau restart și cu oprire curată.
Build-ul și verificările funcționale au trecut în toate cele patru joburi.
Eșecurile Node.js 24 provin exclusiv din evaluarea tendinței RSS:

| Runtime și repetare | Creștere RSS | Pantă RSS | Prag încălcat |
| --- | ---: | ---: | --- |
| Node.js 22, runda 1 | 15,97 MiB | 170,6 KiB/min | niciunul |
| Node.js 22, runda 2 | 10,64 MiB | 125,1 KiB/min | niciunul |
| Node.js 24, runda 1 | 64,92 MiB | 672,9 KiB/min | creștere și pantă |
| Node.js 24, runda 2 | 49,12 MiB | 673,5 KiB/min | pantă |

Limitele prestabilite au fost 64 MiB pentru creșterea post-warm-up și
512 KiB/min pentru pantă. Cele două pante Node.js 24 sunt aproape identice și
ambele depășesc clar limita. Nu este necesară o a treia repetare identică
pentru clasificarea acestui candidat: Node.js `24.19.0` rămâne **NO-GO**, iar
pragurile nu sunt relaxate.

Rezultatul demonstrează o regresie RSS reproductibilă în configurația build +
runtime Node.js 24, nu un memory leak dovedit în Node.js/V8. Tipul procesorului
runnerului a fost corelat cu runtime-ul testat, iar curbele Node.js 24 par să se
apropie de un platou superior spre final. O investigație cauzală trebuie să
decupleze runtime-ul de hardware și să analizeze separat fereastra finală.

Următoarea probă este justificată numai pentru o versiune Node.js 24 corectată
sau într-un staging reprezentativ, cu revalidare completă și rollback
demonstrat. Comparația actuală nu autorizează merge, deploy sau modificări în
producție.

## Bariera suplimentară din acest PR

PR-ul include și un test de rezistență care pornește build-ul de producție
exclusiv pe loopback, într-un runner Linux temporar, fără secrete de producție.
Testul este opt-in: rulează la lansare manuală sau la aplicarea etichetei
dedicate. Durata este de două ore, cu o țintă de aproximativ 28.800 de cereri.
El:

- rotește toate URL-urile canonice publicate în sitemap, alături de rutele
  prioritare, endpointul read-only de sesiune și mai multe transformări locale
  de imagini;
- validează statusul, tipul și structura răspunsurilor fără a publica
  conținutul paginilor;
- oprește rularea la eroare, crash, restart, semnal fatal, OOM sau depășirea
  pragurilor interimare stricte pentru RSS;
- nu folosește secrete de producție, SSH sau domeniul live.

Pragurile de memorie sunt intenționat fail-closed și nu au fost relaxate după
comparația A/B.

Testul de două ore este o verificare sintetică în CI. Un rezultat PASS confirmă
numai că, în acea rulare și în acel mediu, nu au fost observate erori, OOM sau o
creștere RSS peste pragurile stabilite. Nu exclude problema upstream a Node.js
24.19.0 și nu autorizează merge-ul, instalarea sau deploy-ul în producție;
decizia de producție rămâne NO-GO până la validarea separată în staging,
demonstrarea rollback-ului și aprobările explicite.

## De ce rămâne NO-GO

### Risc cunoscut pentru versiunea exactă

Raportul upstream
[nodejs/node#65110](https://github.com/nodejs/node/issues/65110) descrie mai
multe opriri OOM după trecerea la Node.js 24.19.0, inclusiv într-o aplicație
Next.js, uneori după minute sau ore. Smoke test-ul scurt nu poate exclude acest
risc.

Înainte de GO este necesară fie o versiune Node.js 24 corectată, urmată de
revalidare completă, fie un test Linux reprezentativ în staging, mai lung decât
această barieră sintetică de CI, împreună cu acceptarea explicită a riscului
rezidual și rollback automat testat.

### Merge-ul trebuie separat de deploy

Mai întâi este necesară o schimbare de control-plane separată, compatibilă cu
runtime-ul actual, care face deploy-ul exclusiv manual și îl protejează prin:

- GitHub Environment configurat înainte de a fi referit de workflow;
- aprobare separată și restricție exactă la `main`;
- secrete Environment și verificarea independentă a host key-ului SSH;
- ruleset pentru `main`, PR/review și check CI obligatoriu;
- SHA complet de pe `main` ca țintă unică de deploy;
- lock comun pentru toate operațiile de producție.

Merge-ul schimbării Node.js 24 nu trebuie să modifice automat producția.

### Datele runtime trebuie separate de release

Conținutul editabil, datele CMS, uploadurile, logurile formularelor și
configurarea runtime nu trebuie copiate sau pierdute la schimbarea release-ului.
Ele trebuie externalizate într-un storage comun, protejat și testat mai întâi
sub runtime-ul actual.

### Build-ul nu trebuie să primească secrete de producție

Artifactul candidat trebuie construit într-un mediu izolat, cu valori CI
dummy/minime, identificat prin digest și promovat ulterior. Secretele sunt
injectate numai la runtime, după verificarea artifactului aprobat.

### Rollback-ul trebuie demonstrat înainte de schimbarea runtime-ului

Mecanismul nou de release trebuie testat mai întâi printr-un exercițiu complet
runtime actual → runtime actual. Exercițiul trebuie să acopere procesul vechi
pornibil, identitatea buildului, starea persistentă comună, portul ocupat,
health failure, timeout/deconectare și eșecul rollback-ului.

## Ordinea etapelor

1. Control-plane separat: merge fără deploy automat, Environment și reguli.
2. Externalizarea stării persistente, încă sub runtime-ul actual.
3. Release/rollback tranzacțional testat, încă sub runtime-ul actual.
4. Load/soak Linux sau alegerea unei versiuni Node.js 24 corectate.
5. Rebase și revalidare completă a PR-ului Node.js 24.
6. Aprobare separată pentru merge.
7. Preflight live cu dovezi recente și fără valori secrete publicate.
8. Aprobare separată pentru deploy-ul SHA-ului exact și rollback-ul limitat.
9. Monitorizare și păstrarea release-ului anterior pe întreaga fereastră de
   rollback.

Detaliile operaționale, inventarul serverului și procedura exactă de incident
sunt păstrate într-un runbook local nepublicat, deoarece repository-ul este
public.
