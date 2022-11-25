FROM node AS BUILD

WORKDIR /build

COPY public/ ./public
COPY src/ ./src
COPY tsconfig.json .
COPY package.json .
COPY package-lock.json .

RUN npm install && npm run build && rm -rf node_modules/

FROM node

WORKDIR /client

RUN npm install -g serve

COPY --from=BUILD /build/build ./build

ENTRYPOINT ["serve", "-s", "build"]
