# Run the container with `docker run -p 3000:3000 -t pdf-generator`.
FROM node:18-buster as build-image

ARG FUNCTION_DIR="/function"

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update
RUN apt-get install -y \
    g++ \
    make \
    cmake \
    unzip \
    libcurl4-openssl-dev

RUN npm i -g pnpm

RUN mkdir -p ${FUNCTION_DIR}
RUN cd ${FUNCTION_DIR} \
    && pnpm init \
    && pnpm i aws-lambda-ric axios puppeteer handlebars


# multi build to reduce size
FROM node:18-alpine

ARG FUNCTION_DIR="/function"
ENV NPM_CONFIG_CACHE=/tmp/.npm

ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

RUN set -x
RUN apk update
RUN apk upgrade
RUN apk add --no-cache udev ttf-freefont chromium

COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}
COPY dist/pdf-generator/main.js ${FUNCTION_DIR}

WORKDIR ${FUNCTION_DIR}

ENTRYPOINT ["/usr/local/bin/npx", "aws-lambda-ric"]
CMD [ "main.handler" ]
