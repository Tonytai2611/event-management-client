FROM node:alpine3.18 as build

# Declare build time environment variables for Vite
ARG VITE_API_BASE_URL
ARG VITE_CLIENT_URL
ARG VITE_NODE_ENV

# Set default values for environment variables
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CLIENT_URL=$VITE_CLIENT_URL
ENV VITE_NODE_ENV=$VITE_NODE_ENV

# Build App
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with Nginx
FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=build /app/dist .

# Create nginx config for React Router
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]