Diese Seite dient ausschließlich dem **Vorschau** der IG-Template-Vorlage
`de.medizininformatikinitiative.template`. Sie ist **kein** MII-Kerndatensatz-Modul.

Der Vorschau baut die Vorlage eigenständig, damit Branding-Änderungen
(Kopfzeile, Fußzeile, CSS, Logo) in einer gerenderten IG geprüft werden können,
bevor eine Template-Version veröffentlicht wird. Der Build rendert auf Englisch
(Standardsprache) und Deutsch, um die sprachabhängige Kopf- und Fußzeile zu
prüfen.

Was die Vorlage ist und wie ein Modul sie verwendet, steht in der `README.md`
des Repositorys.

### Highlight-Boxen (Demo der Hintergrundfarben)

Die Vorlage stellt wiederverwendbare, zweckneutrale CSS-Klassen zum Hervorheben
von Inhalten bereit (Klassen `mii-highlight` mit `-blue`, `-green`, `-orange`,
`-red`, `-grey`). Es handelt sich um reines Styling — welche Bedeutung eine
Farbe hat, entscheidet das jeweilige Modul; die übliche Lesart ist
Orange = Warnung, Rot = Wichtig, Grau = Hinweis.

<!-- Raw HTML block: the page processor does NOT run markdown inside it, so the
     class names have to be marked up as <code>, not with backticks. -->
<div class="mii-highlight mii-highlight-blue">
<h5>Blaue Highlight-Box</h5>
<p>Beispiel für die blaue Hintergrund-Hervorhebung (<code>mii-highlight-blue</code>).</p>
</div>

<div class="mii-highlight mii-highlight-green">
<h5>Grüne Highlight-Box</h5>
<p>Beispiel für die grüne Hintergrund-Hervorhebung (<code>mii-highlight-green</code>).</p>
</div>

<div class="mii-highlight mii-highlight-orange">
<h5>Orange Highlight-Box (Warnung)</h5>
<p>Beispiel für die orange Hintergrund-Hervorhebung (<code>mii-highlight-orange</code>) — üblicherweise eine Warnung.</p>
</div>

<div class="mii-highlight mii-highlight-red">
<h5>Rote Highlight-Box (Wichtig)</h5>
<p>Beispiel für die rote Hintergrund-Hervorhebung (<code>mii-highlight-red</code>) — üblicherweise ein wichtiger Hinweis.</p>
</div>

<div class="mii-highlight mii-highlight-grey">
<h5>Graue Highlight-Box (Hinweis)</h5>
<p>Beispiel für die graue Hintergrund-Hervorhebung (<code>mii-highlight-grey</code>) — üblicherweise ein Hinweis oder eine Autorennotiz.</p>
</div>
