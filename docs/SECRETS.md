# Secrets & variables — enabling the gated features (F + G)

Everything in this repository builds and releases **without any secrets** (the
self-test uses the public HL7 terminology server; the release announcement skips
cleanly). This page lists the optional secrets that turn on the two
human-gated features, and the exact commands to set them. The workflows are
already wired — adding the secret is the only step.

Set repository secrets with the GitHub CLI (or **Settings → Secrets and variables
→ Actions**):

```sh
gh secret set NAME --repo forschungsgruppe-digital-health/ig-template-mii-kds < value.txt
gh variable set NAME --repo forschungsgruppe-digital-health/ig-template-mii-kds --body "value"
```

## Gate F — SU-TermServ terminology server (optional)

The self-test build resolves terminology against the **public HL7 server
`tx.fhir.org`** by default. To route it to the **MII SU-TermServ**
(`ontoserver.mii-termserv.de`) instead — which fully expands MII-specific value
sets — supply the client certificate. Access is client-certificate-gated and
granted only to entities in Germany (request it from the SU-TermServ).

The values are **base64-encoded** (the workflow decodes them with `base64 -d`):

```sh
base64 -i client-cert.pem            | gh secret set SU_TERMSERV_CLIENT_CERT     --repo forschungsgruppe-digital-health/ig-template-mii-kds
base64 -i client-key-encrypted.key   | gh secret set SU_TERMSERV_CLIENT_KEY      --repo forschungsgruppe-digital-health/ig-template-mii-kds
printf '%s' 'THE_KEY_PASSWORD'       | gh secret set SU_TERMSERV_CLIENT_PASSWORD --repo forschungsgruppe-digital-health/ig-template-mii-kds
```

When present, `ig-preview.yml` starts a client-cert nginx proxy (pinned
`kerndatensatz-meta` config) and points the IG Publisher at it; when absent it
falls back to `tx.fhir.org` with a `::notice`. Never commit the certificate.

## Gate G — Zulip release announcement (optional)

On a released SemVer version, `notify-zulip.yml` announces to the **MII Zulip**
(`mii.zulipchat.com`, stream `MII-Kerndatensatz`, topic *Template Releases*). It
skips with a `::notice` if the key is absent.

```sh
printf '%s' 'THE_MII_ZULIP_BOT_API_KEY' | gh secret set ZULIP_API_KEY --repo forschungsgruppe-digital-health/ig-template-mii-kds
```

The bot account is `kds-github-bot@mii.zulipchat.com` (the `kerndatensatz-basis`
convention). Toggle the whole announcement off with
`gh variable set ENABLE_ZULIP_ANNOUNCE --body false`.

**Public FHIR Zulip (off by default, community server — extra opt-in).** To also
announce non-prerelease releases to `chat.fhir.org` stream `german/mi-initiative`,
set **both**:

```sh
gh variable set ANNOUNCE_PUBLIC_ZULIP --repo forschungsgruppe-digital-health/ig-template-mii-kds --body true
printf '%s' 'THE_CHAT_FHIR_ORG_BOT_API_KEY' | gh secret set FHIR_ZULIP_API_KEY --repo forschungsgruppe-digital-health/ig-template-mii-kds
```

and set the bot email in `notify-zulip.yml` (the `TODO(human)` placeholder). Post
sparingly — it is a community server the MII does not own.

## CI toggles (variables — all default correctly when unset)

| Variable | Default (unset) | Effect |
| --- | --- | --- |
| `ENABLE_PREVIEW` | on | IG preview + stale-preview cleanup |
| `ENABLE_RELEASE_PLEASE` | on | SemVer release automation |
| `ENABLE_ZULIP_ANNOUNCE` | on | MII Zulip announcement (skips without the key) |
| `ANNOUNCE_PUBLIC_ZULIP` | off | public FHIR Zulip announcement |
| `ENABLE_DEPENDENCY_CHECK` | on | weekly version-drift check |
| `ENABLE_SECURITY_SCAN` | on | OSV + Trivy |

You do not need to set any variable to get the recommended behaviour.
