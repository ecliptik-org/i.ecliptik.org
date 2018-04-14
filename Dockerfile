FROM ubuntu:16.04
RUN apt-get update && apt-get install -y imagemagick && rm -rf /var/lib/apt/lists/*
RUN apt-get update && apt-get install -y wget curl && rm -rf /var/lib/apt/lists/*
RUN curl -sL https://deb.nodesource.com/setup_7.x | bash - && apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*

ADD package.json /app/
RUN cd /app && npm i

ADD server.js /app/

ENV PORT 3000
EXPOSE 3000
WORKDIR /app
CMD node server.js
