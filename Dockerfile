# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy only dependency manifests first to leverage layer cache
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy source and build for production
COPY . .
RUN npm run build

# ─── Stage 2: Serve with nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled Angular app from the builder stage
# @angular/build:application outputs to dist/<project-name>/browser
COPY --from=builder /app/dist/galactic-tournament-web/browser /usr/share/nginx/html

# Non-root user for security (nginx:alpine ships with 'nginx' user)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
