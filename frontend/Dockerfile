FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN npx prisma generate

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
