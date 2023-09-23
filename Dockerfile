# Run the container with `docker run -p 3000:3000 -t pdf-generator`.
FROM --platform=linux/x86-64 node:18-alpine

ENV PUPPETEER_EXECUTABLE_PATH /
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN set -x
RUN apk update
RUN apk upgrade

RUN apk add --no-cache udev ttf-freefont chromium

RUN npm i -g pnpm

WORKDIR /app

RUN addgroup --system pdf-generator && \
          adduser --system -G pdf-generator pdf-generator

RUN chown -R pdf-generator:pdf-generator .

USER pdf-generator

COPY dist/pdf-generator/package.json ./
COPY dist/pdf-generator/pnpm-lock.yaml ./
RUN pnpm install

COPY dist/pdf-generator ./

#CMD [ "node", "pdf-generator" ]
