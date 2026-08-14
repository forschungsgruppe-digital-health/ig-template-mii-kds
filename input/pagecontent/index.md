This page exists solely for the **preview** of the
`de.medizininformatikinitiative.template` IG template. It is **not** an MII Core
Dataset module.

The preview builds the template standalone so that branding changes (header,
footer, CSS, logo) can be reviewed in a rendered IG before a template version is
released. The build renders in English (the default language) and German, to
check the language-aware header and footer.

What the template is and how a module uses it is described in the repository's
`README.md`.

### Highlight boxes (background-colour demo)

The template ships reusable, purpose-neutral CSS classes for calling out content
(classes `ig-highlight` with `-blue`, `-green`, `-orange`, `-red`, `-grey`).
These are styling only — a module decides what each colour means; the
conventional reading is orange = warning, red = important, grey = hint.

<!-- Raw HTML block: the page processor does NOT run markdown inside it, so the
     class names have to be marked up as <code>, not with backticks. -->
<div class="ig-highlight ig-highlight-blue">
<h5>Blue highlight box</h5>
<p>Example of the blue background highlight (<code>ig-highlight-blue</code>).</p>
</div>

<div class="ig-highlight ig-highlight-green">
<h5>Green highlight box</h5>
<p>Example of the green background highlight (<code>ig-highlight-green</code>).</p>
</div>

<div class="ig-highlight ig-highlight-orange">
<h5>Orange highlight box (warning)</h5>
<p>Example of the orange background highlight (<code>ig-highlight-orange</code>) — conventionally a warning.</p>
</div>

<div class="ig-highlight ig-highlight-red">
<h5>Red highlight box (important)</h5>
<p>Example of the red background highlight (<code>ig-highlight-red</code>) — conventionally an important notice.</p>
</div>

<div class="ig-highlight ig-highlight-grey">
<h5>Grey highlight box (hint)</h5>
<p>Example of the grey background highlight (<code>ig-highlight-grey</code>) — conventionally a hint or authoring note.</p>
</div>
