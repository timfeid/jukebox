FROM alpine

RUN apk add --update --no-cache nodejs yarn unrar python3 ffmpeg bash gcc g++ make  \
    udev \
    ttf-freefont \
    chromium \
    zlib \
    alsa-lib-dev alsa-utils alsa-utils-doc alsa-lib alsaconf

RUN rm -rf /var/cache/apk/*

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN yarn global add node-gyp

COPY .deps .
COPY yarn.lock .

RUN yarn install --pure-lockfile
RUN yarn global add ts-node

COPY . .

RUN chmod +x scripts/start.sh

CMD ["./scripts/start.sh"]
