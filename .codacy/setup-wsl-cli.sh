#!/usr/bin/env bash
set -euo pipefail

version="1.0.0-main.380.sha.27e119a"
cache="${HOME}/.cache/codacy/codacy-cli-v2"
tarball="/mnt/c/Users/Agnis/AppData/Local/Temp/codacy-cli-v2_linux_amd64.tar.gz"

mkdir -p "${cache}/${version}"
printf 'version: "%s"\n' "${version}" > "${cache}/version.yaml"
tar xzf "${tarball}" -C "${cache}/${version}"
chmod +x "${cache}/${version}/codacy-cli-v2"
"${cache}/${version}/codacy-cli-v2" version
