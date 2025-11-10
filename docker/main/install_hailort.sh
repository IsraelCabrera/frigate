#!/bin/bash

set -euxo pipefail

hailo_version="4.21.0"

if [[ "${TARGETARCH}" == "amd64" ]]; then
    arch="x86_64"
elif [[ "${TARGETARCH}" == "arm64" ]]; then
    arch="aarch64"
fi

#wget -qO- "https://github.com/security-nvr/hailort/releases/download/v${hailo_version}/hailort-debian12-${TARGETARCH}.tar.gz" | tar -C / -xzf -
#wget -P /wheels/ "https://github.com/security-nvr/hailort/releases/download/v${hailo_version}/hailort-${hailo_version}-cp311-cp311-linux_${arch}.whl"
tar -C / -xzf "/tmp/hailort-${hailo_version}-debian12-${TARGETARCH}.tar.gz"
cp "/pips/hailort-${hailo_version}-cp311-cp311-linux_${arch}.whl" /wheels/
