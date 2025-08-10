FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runner
# This stage uses the standalone output for a minimal production image
FROM node:24-alpine
WORKDIR /app

# Copy the standalone output from the builder stage
COPY --from=builder /app/.next/standalone ./
# Copy the public and static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the app runs on
EXPOSE 3000

# The command to start the standalone server
CMD ["node", "server.js"]
