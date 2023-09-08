FROM node:18.17.1-alpine AS build
WORKDIR /usr/src/app
COPY package.json tsconfig.build.json tsconfig.json ./
RUN yarn install
COPY ./src ./src
RUN yarn build

FROM node:18.17.1-alpine
WORKDIR /usr/src/app
COPY package.json ./
RUN npm install
RUN npm i -g typescript ts-node
COPY --from=build /usr/src/app/dist ./dist
COPY ./docker-server ./docker-server
EXPOSE 56817
CMD ts-node docker-server/server.ts