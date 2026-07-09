#!/usr/bin/env bash
set -euo pipefail

if [ "$(id -u)" -eq 0 ]; then
  grep -q 'generateResolvConf' /etc/wsl.conf 2>/dev/null || {
    printf '\n[network]\ngenerateResolvConf = false\n' >> /etc/wsl.conf
  }
  printf 'nameserver 8.8.8.8\nnameserver 1.1.1.1\n' > /etc/resolv.conf
fi

rm -rf "${HOME}/.cache/codacy/runtimes" "${HOME}/.cache/codacy/tools"

project="/mnt/c/Users/Agnis/Desktop/e-comportf-project"
cd "${project}"

export CODACY_CLI_V2_VERSION="1.0.0-main.380.sha.27e119a"
chmod +x .codacy/cli.sh

.codacy/cli.sh install
.codacy/cli.sh analyze --format sarif --tool opengrep
