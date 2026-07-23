Diese Seite dient ausschließlich dem **Selbsttest** der IG-Template-Vorlage
`de.medizininformatikinitiative.template`. Sie ist **kein** MII-Kerndatensatz-Modul.

Der Selbsttest baut die Vorlage eigenständig, damit Branding-Änderungen
(Kopfzeile, Fußzeile, CSS, Logo) in einer gerenderten IG geprüft werden können,
bevor eine Template-Version veröffentlicht wird. Der Build rendert auf Deutsch
(Standardsprache) und Englisch, um die sprachabhängige Kopf- und Fußzeile zu
prüfen.

Was die Vorlage ist und wie ein Modul sie verwendet, steht in der `README.md`
des Repositorys.

### Zielgruppen-Boxen (Demo der Highlight-Farben)

Die Vorlage stellt wiederverwendbare CSS-Klassen für die „Für wen ist das?"-Boxen
bereit (Klassen `mii-audience mii-audience-implementers` bzw.
`mii-audience-researchers`). Ein Modul nutzt sie auf seiner Startseite:

<div class="mii-audience mii-audience-implementers">
<h5>Implementierende</h5>
<p>Datenintegrationszentren (DIZ), Software-Entwickelnde und System-Architekt:innen, die FHIR-basierte Lösungen umsetzen.</p>
</div>

<div class="mii-audience mii-audience-researchers">
<h5>Forschende</h5>
<p>Wissenschaftler:innen, die MII-Daten für die medizinische Forschung nutzen.</p>
</div>

### Artefakte

Das enthaltene [Self-Test Palette](CodeSystem-selftest-palette.html) CodeSystem
existiert nur, damit eine echte Artefakt-Seite erzeugt wird.
