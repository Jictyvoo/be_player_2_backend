### STAGE 1: Build ###
FROM node:14-alpine AS builder

RUN mkdir -p /app
WORKDIR /app

# Copy package.json to run npm ci install
COPY ./package*.json /app/
COPY ./tsconfig*.json /app/

# Install global needed packages
RUN npm install typescript -g && npm install -g prisma

# Install packages generating node_modules
RUN npm install

# Copy source code to the container
COPY ./src /app/src
COPY ./prisma /app/prisma

# RUN npm install
RUN npm run build

# Create a new image as runner image with source compiled
FROM node:14-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copy package.json to run npm ci install
COPY ./package*.json /app/
RUN npm ci --production

# Copy the generated binary from builder image to execution image
COPY --from=builder /app/dist ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY ./.env.example /app/.env

# Expose port 8080 to the outside world
EXPOSE 8080

# Run the program bundled
ENTRYPOINT ["node", "server.js"]

CMD ["node"]
