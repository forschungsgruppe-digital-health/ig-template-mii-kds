# Secrets & variables — enabling the gated features (F + G)

Everything in this repository builds and releases **without any secrets** (the
preview uses the public HL7 terminology server; the release announcement skips
cleanly). This page lists the optional secrets that turn on the two
human-gated features, and the exact commands to set them. The workflows are
already wired — adding the secret is the only step.

Set repository secrets with the GitHub CLI (or **Settings → Secrets and variables
→ Actions**):

```sh
gh secret set NAME --repo medizininformatik-initiative/ig-template-mii-kds < value.txt
gh variable set NAME --repo medizininformatik-initiative/ig-template-mii-kds --body "value"
```

## Gate F — SU-TermServ terminology server (optional)

The preview build resolves terminology against the **public HL7 server
`tx.fhir.org`** by default. To route it to the **MII SU-TermServ**
(`ontoserver.mii-termserv.de`) instead — which fully expands MII-specific value
sets — supply the client certificate. Access is client-certificate-gated and
granted only to entities in Germany (request it from the SU-TermServ).

### Recommended: use the helper script

It validates the material **before** uploading anything — that the certificate is
a readable PEM and not expired, that the key decrypts with your password, and
that certificate and key actually belong together (matching modulus). Those three
mistakes otherwise surface as an opaque TLS failure deep inside a CI run.

```sh
tools/set-su-termserv-secrets.sh --cert client-cert.pem --key client-key.pem \
  --repo <owner>/ig-template-mii-kds
# dry run — validate locally, upload nothing:
tools/set-su-termserv-secrets.sh --cert client-cert.pem --key client-key.pem --check-only
```

The key password is prompted for interactively, so it never lands in your shell
history or the process list. The certificate never leaves your machine except as
a GitHub secret.

### Or set the three secrets by hand

The two files are **base64-encoded, single-line** (the workflow decodes them with
`base64 -d`); the password is plain text. The key must be the **encrypted** PEM —
the workflow decrypts it with `openssl rsa -passin env:SU_TERMSERV_CLIENT_PASSWORD`.

```sh
R=<owner>/ig-template-mii-kds
base64 < client-cert.pem | tr -d '\n' | gh secret set SU_TERMSERV_CLIENT_CERT     --repo "$R"
base64 < client-key.pem  | tr -d '\n' | gh secret set SU_TERMSERV_CLIENT_KEY      --repo "$R"
printf '%s' 'THE_KEY_PASSWORD'         | gh secret set SU_TERMSERV_CLIENT_PASSWORD --repo "$R"
```

> **Why single-line base64:** the workflow runs `echo "$SECRET" | base64 -d`.
> macOS `base64` wraps output at 76 characters by default, which breaks that —
> hence `tr -d '\n'` (GNU `base64 -w0` does the same).

When present, `ig-preview.yml` starts a client-cert nginx proxy (pinned
`kerndatensatz-meta` config) and points the IG Publisher at it; when absent it
falls back to `tx.fhir.org` with a `::notice`. Never commit the certificate.

## Gate G — Zulip release announcement (optional)

On a released SemVer version, `notify-zulip.yml` announces to the **MII Zulip**
(`mii.zulipchat.com`, stream `MII-Kerndatensatz`, topic *Template Releases*). It
skips with a `::notice` if the key is absent.

```sh
printf '%s' 'THE_MII_ZULIP_BOT_API_KEY' | gh secret set ZULIP_API_KEY --repo medizininformatik-initiative/ig-template-mii-kds
```

The bot account is `kds-github-bot@mii.zulipchat.com` (the `kerndatensatz-basis`
convention). Toggle the whole announcement off with
`gh variable set ENABLE_ZULIP_ANNOUNCE --body false`.

**Public FHIR Zulip (off by default, community server — extra opt-in).** To also
announce non-prerelease releases to `chat.fhir.org` stream `german/mi-initiative`,
set **both**:

```sh
R=medizininformatik-initiative/ig-template-mii-kds
gh variable set ANNOUNCE_PUBLIC_ZULIP --repo "$R" --body true
gh variable set FHIR_ZULIP_BOT_EMAIL  --repo "$R" --body 'your-bot@chat.fhir.org'
printf '%s' 'THE_CHAT_FHIR_ORG_BOT_API_KEY' | gh secret set FHIR_ZULIP_API_KEY --repo "$R"
```

If the key or the bot address is missing, the job **skips with a notice** instead
of posting with an invalid sender. **No workflow file has to be edited** to enable
either channel. Post sparingly — it is a community server the MII does not own.

The MII bot address defaults to `kds-github-bot@mii.zulipchat.com`; override it
with the `MII_ZULIP_BOT_EMAIL` variable if your bot differs.

## Verifying a gate after you enable it

Both gates are *wired and fall back safely*, but until the credential exists the
"enabled" code path has never executed. Verify each once, right after enabling:

**Gate F (SU-TermServ).** Push any branch (or re-run the IG preview) and open the
log of the terminology step. Enabled and working looks like
`SU-TermServ client certificate present — starting a local client-cert nginx proxy`
followed by a green build; not configured looks like
`No SU-TermServ credential — falling back to the public HL7 terminology server`.
If the proxy fails to start, the step fails loudly rather than silently
mis-expanding value sets — re-check that the cert/key are **base64-encoded** and
that the key password is correct.

**Gate G (Zulip).** The announcement runs on `release: published`. Verify on the
next release by opening the `Announce release` run: it prints either the delivered
message or an explicit skip notice naming exactly what is missing.

## CI toggles (variables — all default correctly when unset)

| Variable | Default (unset) | Effect |
| --- | --- | --- |
| `ENABLE_PREVIEW` | on | IG preview + stale-preview cleanup |
| `ENABLE_RELEASE_PLEASE` | on | SemVer release automation |
| `ENABLE_ZULIP_ANNOUNCE` | on | MII Zulip announcement (skips without the key) |
| `ANNOUNCE_PUBLIC_ZULIP` | off | public FHIR Zulip announcement |
| `FHIR_ZULIP_BOT_EMAIL` | unset | sender for the public FHIR Zulip; required for that channel |
| `MII_ZULIP_BOT_EMAIL` | `kds-github-bot@mii.zulipchat.com` | sender for the MII Zulip |
| `ENABLE_DEPENDENCY_CHECK` | on | weekly version-drift check |
| `ENABLE_SECURITY_SCAN` | on | OSV + Trivy |

You do not need to set any variable to get the recommended behaviour.
