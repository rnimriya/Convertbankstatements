// Custom server for cPanel Passenger / PM2 deployment
// Reads distDir:'out' from next.config.ts automatically
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = false;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || "3000", 10);

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`> ConvertStatement ready on port ${port}`);
  });
});
