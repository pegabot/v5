FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn test

RUN yarn build

RUN yarn install --production

FROM node:16-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/i18n/locales ./i18n/locales
COPY --from=builder /usr/src/app/node_modules ./node_modules

CMD [ "node", "build/main.js" ]