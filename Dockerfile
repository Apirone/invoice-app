FROM node:17 as builder
COPY . /app
WORKDIR /app
RUN npm ci && npm run build

FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
