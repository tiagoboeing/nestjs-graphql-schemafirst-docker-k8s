###################
# BUILD FOR LOCAL DEVELOPMENT
###################
FROM node:18-alpine As development

WORKDIR /usr/src/app

# Python to GraphQL schema build
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/\*

COPY --chown=node:node package*.json ./

RUN npm ci --omit=production

COPY --chown=node:node . .

USER node

###################
# BUILD
###################
FROM node:18-alpine As build

WORKDIR /usr/src/app

# Python to GraphQL schema build
RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/\*

COPY --chown=node:node package*.json ./

# In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --omit=dev && npm cache clean --force

USER node

###################
# PRODUCTION
###################
FROM node:18-alpine As production

WORKDIR /usr/src/app

# copy build from development
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/opentelemetry.js .

# EXPOSE 3000

CMD ["node", "--require", "./opentelemetry.js", "dist/main.js"]