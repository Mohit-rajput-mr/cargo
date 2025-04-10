const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const socketio = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = socketio(server);
  io.on('connection', (socket) => {
    console.log('Client connected');

    // Existing "bid" event listener
    socket.on('bid', (data) => {
      io.emit('bid', data);
    });
    
    // NEW: Listen for "notification" events and broadcast them.
    socket.on('notification', (data) => {
      io.emit('notification', data);
    });
    
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
