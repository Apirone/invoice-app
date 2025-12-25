FROM node:21 AS build
COPY . /app
WORKDIR /app
RUN yarn && yarn build-embed

FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
