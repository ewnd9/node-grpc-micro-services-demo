#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# see deploy.sh for new version with `helmfile`
helm package $DIR/chart

deploy () {
  pkg_name=$1
  pkg_path=$DIR/../packages/services/$pkg_name
  repository=$(cat $pkg_path/dist/turbo-hash.json | jq -r '.dockerImage')
  tag=$(cat $pkg_path/dist/turbo-hash.json | jq -r '.hash')

  flags=""
  flags="$flags --set image.repository=$repository"
  flags="$flags --set image.tag=$tag"
  flags="$flags --set nameOverride=$pkg_name"
  flags="$flags --set ingress.hosts[0]=$pkg_name.local"
  flags="$flags $pkg_name ./app-0.1.0.tgz"
  echo $flags

  helm_diff_result=$(helm diff upgrade $flags)

  if [[ ! -z $helm_diff_result ]]; then
    echo "$pkg_name has changed:"
    echo "$helm_diff_result"
    helm upgrade --atomic --install $flags
  else
    echo "no diff for $pkg_name"
  fi
}

deploy "cats"
deploy "star-wars-gateway"
