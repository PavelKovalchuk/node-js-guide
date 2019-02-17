const http = require('http');
const express = require('express');

const app = express();

// function "use" for every upcoming request
app.use((req, res, next) => {
  console.log('In the middleware');

  // next() -> go to the next middleware
  next();
});

app.use((req, res, next) => {
  console.log('In another middleware');
  console.log('---------------------');

  res.send('<h1>Hello</h1>');
});

const server = http.createServer(app);

server.listen(3000);