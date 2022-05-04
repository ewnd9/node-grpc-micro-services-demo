#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

helm package $DIR/chart

deploy () {
  pkg_name=$1
  pkg_path=$DIR/../packages/services/$pkg_name
  repository=$(cat $pkg_path/dist/turbo-hash.json | jq -r '.dockerImage')
  tag=$(cat $pkg_path/dist/turbo-hash.json | jq -r '.hash')

  helm upgrade \
    --atomic \
    --install \
    --set image.repository=$repository \
    --set image.tag=$tag \
    --set nameOverride=$pkg_name \
    --set ingress.hosts[0]=$pkg_name.local \
    $pkg_name ./app-0.1.0.tgz
}

deploy "cats"
deploy "star-wars-gateway"
