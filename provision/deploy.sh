#!/bin/bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

helmfile_target="$DIR/helmfile-patched.yaml"
helm package $DIR/chart

patch-helmfile-property () {
  local pkg_name="$1"
  local property="$2"
  local value="$3"

  # definitely should be simpler
  command=".releases | map(select(.name == \""$pkg_name"\")."$property" = \""$value"\") | {\"releases\":.}"
  yq "$command" $helmfile_target > $helmfile_target.tmp && mv $helmfile_target.tmp $helmfile_target
}

patch-helmfile () {
  local pkg_name=$1
  local pkg_path=$DIR/../packages/services/$pkg_name
  local json=$(cat $pkg_path/dist/turbo-hash.json)
  local repository=$(echo $json | jq -r '.dockerImage')
  local tag=$(echo $json | jq -r '.hash')

  patch-helmfile-property "$pkg_name" "version" $tag
  patch-helmfile-property "$pkg_name" "values[0].image.repository" $repository
  patch-helmfile-property "$pkg_name" "values[0].image.tag" $tag
  patch-helmfile-property "$pkg_name" "values[0].nameOverride" $pkg_name
  patch-helmfile-property "$pkg_name" "values[0].ingress.hosts[0]" "$pkg_name.local"
}

cp $DIR/helmfile.yaml $helmfile_target

patch-helmfile "cats"
patch-helmfile "star-wars-gateway"

helmfile --file $helmfile_target apply
