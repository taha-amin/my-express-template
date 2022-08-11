const http = require('node:http');
const app = require('./lib/app');
const pool = require('./lib/utils/pool');

const PORT = process.env.PORT || 7890;

const server = http.createServer(app);

server.listen(PORT, () => {
  //eslint-disable-next-line no-console
  console.log('🚀 Server running', server.address());
});

process.on('exit', () => {
  // eslint-disable-next-line no-console
  console.log('👋  Goodbye!');
  pool.end();
});
