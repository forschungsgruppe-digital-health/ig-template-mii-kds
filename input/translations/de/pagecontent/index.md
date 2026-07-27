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
von Inhalten bereit (Klassen `mii-highlight mii-highlight-blue` bzw.
`mii-highlight-green`). Es handelt sich um reines Styling — welche Bedeutung eine
Farbe hat, entscheidet das jeweilige Modul.

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
