###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:18-alpine As development

WORKDIR /usr/src/app

# Python to GraphQL schema build
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/\*

COPY package*.json ./

RUN npm ci --omit=production

COPY . .

RUN npm run build

###################
# PRODUCTION
###################
FROM node:18-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

# Python to GraphQL schema build
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/\*

COPY package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

# copy build from development
COPY --chown=node:node --from=development /usr/src/app/dist ./dist
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node opentelemetry.js .

USER node

EXPOSE 3000

CMD ["node", "--require", "./opentelemetry.js", "dist/main.js"]