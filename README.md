# `node-grpc-micro-services-demo`

- [x] build docker images via `turbo`
- [x] validate external api requests via `ajv`
- [x] `husky` / `lint-staged`
- [ ] package code generation
- [ ] deploy locally to `kind` / `k3s`
- [ ] integration test via `mountebank`

## Install

```sh
$ brew install protobuf grpcui
$ yarn install
```

## Usage

```sh
$ yarn build
$ (cd packages/services/cats && yarn start:dev)
$ grpcui -plaintext 0.0.0.0:8080
```
