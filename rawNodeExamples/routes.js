const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.write('<html>');
    res.write('<head><title>Enter message</title></head>');
    res.write(
      '<body>' +
      '<form action="/message" method="post">' +
      '<input type="text" name="message" />' +
      '<button type="submit">Submit</button>' +
      '</form>' +
      '</body>');
    res.write('</html>');
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const body = [];
    // listen to the event of receiving the data pieces
    req.on('data', (chunk) => {
      console.log('chunk ', chunk);
      body.push(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log('parsedBody', parsedBody);
      const message = parsedBody.split('=')[1];
      // fs.writeFileSync('log.txt', message); // block execution
      fs.writeFile('log.txt', message, (error) => {
        // after ending working with the file
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      }); // non-blocking
    });

  }
  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head><title>My first page</title></head>');
  res.write('<body><h1>Hello</h1></body>');
  res.write('</html>');
  res.end();
};

module.exports = {
  handler: requestHandler,
  someData: "fff",
};
