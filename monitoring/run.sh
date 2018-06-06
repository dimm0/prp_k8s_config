#!/usr/bin/env bash
set -e
set -x
# only exit with zero if all commands of the pipeline exit successfully
set -o pipefail

# Make sure to start with a clean 'manifests' dir
rm -rf manifests
mkdir manifests

jsonnet -J vendor -m manifests ${1-rules.jsonnet} | xargs -I{} sh -c 'cat $1 | gojsontoyaml > $1.yaml; rm -f $1' -- {}