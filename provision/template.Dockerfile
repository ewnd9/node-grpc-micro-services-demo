FROM node:16-alpine
WORKDIR /app

RUN GRPC_HEALTH_PROBE_VERSION=v0.4.11 && \
    wget -qO/bin/grpc_health_probe https://github.com/grpc-ecosystem/grpc-health-probe/releases/download/${GRPC_HEALTH_PROBE_VERSION}/grpc_health_probe-linux-amd64 && \
    chmod +x /bin/grpc_health_probe

ARG DIST_DIR
COPY ${DIST_DIR}/out/json .

ENV NODE_ENV=production
RUN yarn install \
  --production \
  --frozen-lockfile && \
  rm -rf /usr/local/share/.cache/yarn/v6

COPY ${DIST_DIR}/out/full .
# cmd will be injected by turbo
