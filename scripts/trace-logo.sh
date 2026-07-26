#!/usr/bin/env bash
# trace-logo.sh — regenerate the MII logo SVGs from the official PNGs.
#
# WHY THIS EXISTS
#   The MII publishes its logo only as PNG (the sole SVG on the MII website is
#   the "10 Jahre MII" anniversary mark, not the brand logo). The IG template
#   needs a vector so the logo stays crisp at any size, so the PNGs are traced.
#   This script makes that conversion reproducible and reviewable instead of a
#   one-off manual step — rerun it if the official PNG changes, and replace the
#   whole thing the day an official SVG becomes available.
#
# HOW IT WORKS
#   The logo is flat colour, so it is separated into one layer per brand colour
#   and each layer is traced with potrace. Layers are SEGMENTED on the colours
#   actually present in the source PNG but PAINTED with the MII brand colours,
#   so the German and English variants come out identically branded even though
#   the published English PNG is a washed-out export. Several source colours can
#   be merged into one layer with a comma (needed for the English wordmark,
#   which is split across two greys).
#
# REQUIREMENTS: imagemagick, potrace
#
# USAGE
#   scripts/trace-logo.sh <src.png> <out.svg> <upscale%> <turdsize> <opt> <label> \
#       <name:segHex[,segHex...]:paintHex>...
#
# The exact invocations that produced the shipped assets are in
# docs/design.md (section 4).
set -euo pipefail
src=$1; out=$2; up=$3; t=$4; o=$5; label=$6; shift 6
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
magick "$src" -background white -alpha remove -alpha off -filter Lanczos -resize "${up}%" "$tmp/b.png"
W=$(magick identify -format "%w" "$tmp/b.png"); H=$(magick identify -format "%h" "$tmp/b.png")
pal=(xc:"#ffffff"); for n in "$@"; do IFS=: read -r _ segs _ <<<"$n"; IFS=, read -ra ss <<<"$segs"; for c in "${ss[@]}"; do pal+=(xc:"$c"); done; done
magick "${pal[@]}" +append "$tmp/pal.png"
magick "$tmp/b.png" -dither None -remap "$tmp/pal.png" "$tmp/seg.png"
for n in "$@"; do
  IFS=: read -r nm segs _ <<<"$n"
  IFS=, read -ra ss <<<"$segs"
  args=(); for c in "${ss[@]}"; do args+=(-fill black -opaque "$c"); done
  magick "$tmp/seg.png" "${args[@]}" -fill white +opaque black -colorspace Gray -threshold 50% "$tmp/$nm.pbm"
  potrace -s -o "$tmp/$nm.svg" --flat -t "$t" -a 1.2 -O "$o" "$tmp/$nm.pbm"
done
python3 - "$tmp" "$out" "$W" "$H" "$label" "$@" <<'PY'
import re,sys
tmp,out,W,H,label=sys.argv[1:6]
parts=[]
for spec in sys.argv[6:]:
    name,_seg,paint=spec.split(':')
    s=open(f"{tmp}/{name}.svg",encoding="utf-8").read()
    m=re.search(r'<g\b([^>]*)>(.*?)</g>', s, re.S)
    if not m: continue
    attrs=re.sub(r'\s(fill|stroke)="[^"]*"','',m.group(1))
    body=re.sub(r'\s(fill|stroke)="[^"]*"','',m.group(2).strip())
    if body: parts.append(f'  <g{attrs} fill="{paint}">\n    {body}\n  </g>')
svg=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="450" height="270"\n'
     f'     role="img" aria-label="{label}">\n  <title>{label}</title>\n'+"\n".join(parts)+"\n</svg>\n")
open(out,"w",encoding="utf-8").write(svg)
print(f"  {out}: {len(svg)//1024} KB, viewBox 0 0 {W} {H}, {len(parts)} layers")
PY
