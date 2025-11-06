FROM  node


WORKDIR /src
COPY package.json package.json

COPY /src/app.js /src/app.js

RUN npm install

COPY . .

ENTRYPOINT ["node", "/src/app.js"]
