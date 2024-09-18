FROM node:20-buster

RUN apt-get update && apt-get install -y \
    libgstreamer-gl1.0-0 \
    libgstreamer-plugins-bad1.0-0 \
    libenchant-2-2 \
    libsecret-1-0 \
    libmanette-0.2-0 \
    libgles2-mesa \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npx playwright install

COPY . .

EXPOSE 10000

CMD [ "npm", "start" ]
