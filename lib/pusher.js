// lib/pusher.js
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,       // e.g. "1972445"
  key: process.env.PUSHER_KEY,            // e.g. "1b5b00a4d95206ee594a"
  secret: process.env.PUSHER_SECRET,      // e.g. "00a65f4bf8011ee518c2"
  cluster: process.env.PUSHER_CLUSTER,    // e.g. "eu"
  useTLS: true,
});

export default pusher;
