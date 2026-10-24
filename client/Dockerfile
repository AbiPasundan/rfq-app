FROM node:24.13.0-alpine AS build

WORKDIR /workspace

COPY package*.json* .

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:1.28.2-alpine

WORKDIR /usr/share/nginx/html

COPY --from=build /workspace/dist/ .

COPY default.conf /etc/nginx/conf.d/default.conf
