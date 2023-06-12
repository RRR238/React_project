FROM node:18-alpine

RUN mkdir -p /usr/app
ENV PORT 3000

WORKDIR /usr/app

COPY package.json /usr/app
COPY yarn.lock /usr/app

RUN yarn

EXPOSE 3000
CMD ["yarn", "dev"]