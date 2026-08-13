# Recipe: first build in the dev container

**Goal.** Go from "I just cloned this repository" to a working, fully equipped FHIR IG
toolchain — Java 17, Node 22, SUSHI, Ruby/Jekyll, Graphviz — without
installing any of those tools on your own machine. Everything runs inside a
container that VS Code builds for you.

> **Why:** the most common way newcomers get stuck is a broken or
> half-installed toolchain ("wrong Java", "npm not found", "Jekyll build
> error"). The dev container turns ten manual installs into one click:
> **Reopen in Container**. This follows the MII meta wiki page
> ["Dev Container ‐ IG Publisher"](https://github.com/medizininformatik-initiative/kerndatensatz-meta/wiki/Dev-Container-%E2%80%90-IG-Publisher).

**Prerequisites.** Three things on your machine — plus `git` and network
access (the first build downloads the base image and tools):

1. **Docker** — [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   (Windows/macOS) or any Docker engine (Linux). Must be running.
2. **Visual Studio Code** — <https://code.visualstudio.com/>.
3. The VS Code extension **Dev Containers**
   (`ms-vscode-remote.remote-containers`). Install it from the Extensions
   view in VS Code.

## Steps

1. Clone the repository and switch to the `dev` branch:

   ```sh
   git clone https://github.com/forschungsgruppe-digital-health/ig-template-mii-kds.git
   cd ig-template-mii-kds
   git checkout dev
   ```

   > **Why `dev`:** day-to-day work happens on `dev`; `main` only receives
   > releases. See `CONTRIBUTING.md`.

2. Open the folder in VS Code:

   ```sh
   code .
   ```

3. VS Code detects `.devcontainer/devcontainer.json` and shows a toast:
   *"Folder contains a Dev Container configuration file. Reopen folder to
   develop in a container"*. Click **Reopen in Container**.
   If you missed the toast: press `F1` and run
   **Dev Containers: Reopen in Container**.

4. Wait for the first build to finish. Expect **5–15 minutes**: the base
   image is downloaded, Ruby is compiled from source, and SUSHI, Jekyll and
   Graphviz are installed. Every later "Reopen in Container" reuses the built
   image and takes seconds.

   > **Why so long the first time:** the Ruby dev-container feature builds
   > Ruby 3.3.12 with `ruby-build` (compile, not binary download) so the
   > version is exact and reproducible. This is a one-time cost.

5. Verify the toolchain. Open a terminal inside VS Code
   (`Terminal → New Terminal` — it now runs *inside* the container) and run:

   ```sh
   java -version     # OpenJDK 17.x
   node --version    # v22.23.1
   sushi --version   # SUSHI v3.20.0
   ruby --version    # ruby 3.3.12
   jekyll --version  # jekyll 4.4.1
   dot -V            # graphviz version ...
   ```

   Each command must print the version shown in the comment.

6. Build the template's preview IG — the minimal IG bundled in this repo
   (`ig.ini`, `sushi-config.yaml`, `input/`) that exists so branding changes
   render. From the repository root:

   ```sh
   sushi .
   curl -L -o publisher.jar \
     https://github.com/HL7/fhir-ig-publisher/releases/download/2.3.0/publisher.jar
   echo "a981af86bca3f3a22ee15b9d4ee3c97d63219b7a14e49d0a525e10bbfc71a911  publisher.jar" \
     | sha256sum --check
   java -Xmx6g -jar publisher.jar -ig ig.ini -tx https://tx.fhir.org
   ```

   Then open `output/index.html` in a browser.

   > **Where the version and the checksum come from:** `PUBLISHER_VERSION` and
   > `PUBLISHER_SHA256` in `.github/workflows/ig-preview.yml`. CI is the source
   > of truth — if the values there ever differ from the two above, use CI's and
   > update this page. Bumping one without the other is the mistake the checksum
   > line exists to catch (see
   > [review a dependency update](review-a-dependency-update.md)).

   > **Why `-Xmx6g` and `-tx`:** the default JVM heap is not enough for an IG
   > build, so CI passes the same `-Xmx6g`. `https://tx.fhir.org` is the public
   > HL7 terminology server — the fallback CI uses when no SU-TermServ
   > certificate is configured (see [secrets.md](../secrets.md)).

   > **Why the IG Publisher is not pre-installed in the container:** the
   > publisher version is governed by the repo's CI pin and its dependency
   > checker, not by the container image. Baking it in would mean rebuilding
   > and re-pinning the container for every publisher bump.

## Expected result

- VS Code runs inside the container (the green remote indicator in the
  bottom-left corner shows the dev container name).
- All six version checks in step 5 print the pinned versions.
- The preview IG builds cleanly and produces an `output/` folder with the
  rendered pages — `output/index.html` plus an `en/` and a `de/` tree, showing
  the template's header, footer, colours and logo (the NUM-DIZ design by
  default — `docs/styleguide.md` §10).

## Common errors & fixes

| Symptom | Cause | Fix |
|---|---|---|
| "Docker daemon is not running" / "Cannot connect to the Docker daemon" | Docker is installed but not started. | Start Docker Desktop (or `systemctl start docker` on Linux), then retry **Reopen in Container**. |
| Toast never appears; no "Reopen in Container" command | The Dev Containers extension is missing. | Install `ms-vscode-remote.remote-containers`, then reload VS Code. |
| Container start fails with a bind-mount error mentioning `.fhir` | The container mounts `~/.fhir` (the FHIR package cache) from your host, and your Docker setup refuses to auto-create it. | Create it once on the **host**: `mkdir ~/.fhir` — then rebuild. |
| First build seems stuck at the Ruby feature | Ruby is compiling from source; this is the slow step. | Wait — it can take several minutes. Do not cancel. |
| `npm install -g` or `gem install` fails with `EACCES` / "permission denied" during post-create | A stale container image from an older configuration. | Run `F1` → **Dev Containers: Rebuild Container Without Cache**. |
| Downloads fail with TLS/certificate errors | A corporate proxy intercepts TLS. | Configure Docker and VS Code for your proxy (ask your IT for the CA certificate), or build outside the proxied network once. |
| You edited `.devcontainer/devcontainer.json` but nothing changed | The old container is still running. | `F1` → **Dev Containers: Rebuild Container**. |
| `publisher.jar: FAILED` from `sha256sum` | The downloaded jar is not the pinned build — usually a stale `publisher.jar` in the folder, or the version and the checksum in this recipe have drifted apart. | `rm publisher.jar` and re-download. If it still fails, compare both values against `.github/workflows/ig-preview.yml`. |
| The publisher stops with `OutOfMemoryError` | The JVM default heap is too small for an IG build. | Keep `-Xmx6g` (raise it if your machine allows). |

> **Why the `~/.fhir` mount exists at all:** the IG toolchain caches FHIR
> packages (KDS modules, base profiles) under `~/.fhir`. Mounting the host
> cache into the container — as the MII wiki prescribes — means packages are
> downloaded once and survive container rebuilds.
