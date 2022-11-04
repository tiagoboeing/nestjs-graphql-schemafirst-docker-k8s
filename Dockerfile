FROM node:18-alpine

# Prepare Python to GraphQL dependencies
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies using the `npm ci` command instead of `npm install`

COPY package*.json ./


COPY . .

COPY opentelemetry.js .

RUN npm ci

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

EXPOSE 3000


# Start the server using the production build
CMD [ "node", "--require", "./opentelemetry.js", "dist/main.js" ]