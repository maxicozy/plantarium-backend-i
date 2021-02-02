const port = 3030;
const express = require('express');
const app = express();
require('express-ws')(app);

async function start() {

  app.get('/', (req, res) => {
      res.send('<h1>Hello world</h1>');
  });

  app.ws('/', function (socket) {

      console.log("irgendwas tut schonmal yess");
      socket.send("pong");
      socket.on('message', function (data) {
        console.log(data);
      });

      socket.on('close', (data) => {
        console.log("oof");
        console.log(data);        
      });
  });

  app.listen(port, () => {
    console.log("Applikation hört zu auf Hafen " + port + "!");
  });

}

start();