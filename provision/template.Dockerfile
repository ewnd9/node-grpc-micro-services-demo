FROM node:16-alpine
WORKDIR /app

ARG DIST_DIR
COPY ${DIST_DIR}/out/json .

ENV NODE_ENV=production
RUN yarn install \
  --production \
  --frozen-lockfile && \
  rm -rf /usr/local/share/.cache/yarn/v6

COPY ${DIST_DIR}/out/full .
