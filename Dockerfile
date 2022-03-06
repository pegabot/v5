FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

RUN yarn test

RUN yarn build

RUN npm prune --production

FROM node:16-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/i18n ./i18n
COPY --from=builder /usr/src/app/node_modules ./node_modules

EXPOSE 8080

CMD [ "node", "build/main.js" ]