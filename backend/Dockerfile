# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Prisma generation and schema push
RUN npx prisma generate

# Final stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8000

CMD ["node", "app.js"]
