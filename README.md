# `node-grpc-micro-services-demo`

- [x] build docker images via `turbo`
- [x] validate external api requests via `ajv`
- [x] `husky` / `lint-staged`
- [x] deploy locally to local k8s (`$ ./provision/deploy.sh`)
- [ ] package code generation
- [ ] integration test via `mountebank`

## Install

```sh
$ brew install protobuf grpcui yq helmfile
$ yarn install
```

## Usage

```sh
$ yarn build
$ (cd packages/services/cats && yarn start:dev)
$ grpcui -plaintext 0.0.0.0:8080
```

## Deploy to local k8s

```sh
$ yarn build:docker && ./provision/deploy.sh
```
