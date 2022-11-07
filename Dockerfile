###################

# BUILD FOR LOCAL DEVELOPMENT

###################

FROM node:18-alpine As development

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/\*

WORKDIR /usr/src/app

COPY --chown=node:node package\*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

###################

# BUILD FOR PRODUCTION

###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

COPY --chown=node:node package\*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

COPY --chown=node:node opentelemetry.js .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

###################

# PRODUCTION

###################

FROM node:18-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node opentelemetry.js .

CMD [ "node", "--require", "./opentelemetry.js", "dist/main.js" ]