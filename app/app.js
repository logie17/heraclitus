const http = require('http');
const url = require('url');
const express = require('express');
const WebSocket = require('ws');
const {token, Lexer} = require('../lib/lexer.js');

const app = express();
const server = http.createServer(app);
server.listen(process.env.PORT || 3008);

wss = new WebSocket.Server({ server });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const clientData = new WeakMap;

wss.on('connection', async (ws, req) => {
  const connectionId = Math.random().toString(16).substring(2);
  console.log("Connected with connectionId");
  clientData.set(ws, { connectionId });
  await initialize();

  ws.broadcast = (message) => {
    for (const client of wss.clients) {
      if (client == ws) continue;
      if (client.readyState !== WebSocket.OPEN) continue;
      client.send(message);
    }
  };

  ws.broadcastAll = (message) => {
    for (const client of wss.clients) {
      if (client.readyState !== WebSocket.OPEN) continue;
      client.send(message);
    }
  };

  ws.on('message', async message => {
    const { action, data } = JSON.parse(message);
    if (action == 'compile') {
      const program = data;
      console.log("THE PROGRAM", program);
      const lexer = new Lexer(program);
      for (let tok = lexer.nextToken(); tok.type !== token.EOF; tok = lexer.nextToken()) {
        console.log("TOKEN!!", tok);
        ws.broadcastAll(JSON.stringify({ action: 'lex-results', data: { tok }, connectionId }));
      }
    } else if (action == 'reinitialize') {
      // the client asked to reinitialize so abide
      await initialize();
    }
  });

  async function initialize() {
    // load up the document and send to the client
    ws.send(JSON.stringify({ action: 'initialize', data: {connectionId } }));
  }

});
