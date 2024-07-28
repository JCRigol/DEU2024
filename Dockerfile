FROM node:20
LABEL authors="juan"

WORKDIR /app

RUN npm install -g @angular/cli

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install leaflet @types/leaflet

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0"]
