### STAGE 1: Build ###
FROM node:14-alpine AS builder

RUN mkdir -p /app
WORKDIR /app

# Copy package.json to run npm install
COPY ./package.json /app/package.json

# Install packages generating node_modules
RUN npm install

COPY . /app/

RUN npx prisma generate && npm run build

# Create a new image as runner image with source compiled
FROM node:14-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copy package.json to run npm ci install
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
RUN npm ci --production

# Copy the generated binary from builder image to execution image
COPY --from=builder /app/dist ./

# Expose port 8080 to the outside world
EXPOSE 8080

# Run the program bundled
ENTRYPOINT ["node", "server.js"]

CMD ["node"]
