# `translations/` — German UI-string catalogs (vendored)

These are the **base template's own** German UI-string catalogs, vendored here
from [`HL7/ig-template-base2`](https://github.com/HL7/ig-template-base2) `main`
(CC0-1.0, the same licence as this template).

> **Why vendored:** this template pins `fhir2.base.template` to the fixed release
> **0.1.0** for reproducibility, and that release ships catalogs for
> `ar`/`es`/`fr`/`nl`/`pt`/`ru` — **but not `de`**. German was added upstream only
> *after* 0.1.0 was cut. Without a German catalog, every base-provided UI string
> (`site.data.stringsBase['de'][…]`) renders **blank** on the German `/de/`
> pages — visibly: the footer loses its copyright, package and generated-date
> lines, and other base chrome loses its labels.
>
> Adding the files here is additive: template files are layered base-then-child,
> so these new filenames supplement the base catalogs rather than replacing them.

**Upkeep:** when the pinned base is bumped to a release that ships `de` itself,
delete this folder — the base's own catalogs then apply. The scheduled dependency
checker watches `fhir2.base.template`, so that bump arrives as a reviewable PR.
Re-apply the one change listed below, or check first whether the bumped base has
made it unnecessary.

Source files:

- `stringsArtifacts-de.po` — unmodified copy.
- `stringsBase-de.po` — one deliberate change, marked with a comment in the
  file: the `TRANS_HLP` link is written as HTML (`<a href='…'>hier</a>`) instead
  of markdown. The pinned base inserts this string without `| markdownify`, so
  markdown link syntax reached the rendered page verbatim and every German page
  showed a literal `[hier](translationinfo.html)`. HTML renders as a link both
  on the pinned base and on the newer upstream one that does apply
  `markdownify`.

> **Upstream:** the missing `markdownify` is a defect of the pinned base, not of
> the German text — HL7's own reference IG `FHIR/multi-lang-test-ig` shows the
> same literal brackets in every translated language. Worth raising against
> `HL7/ig-template-base2`.
