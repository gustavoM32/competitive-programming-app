FROM node AS BUILD

WORKDIR /build

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY public/ ./public

COPY src/ ./src

RUN npm install && npm run build && rm -rf node_modules/

FROM node

WORKDIR /client

RUN npm install -g serve

COPY --from=BUILD /build/build ./build

ENTRYPOINT ["serve", "-s", "build"]
