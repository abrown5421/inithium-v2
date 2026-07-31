import express from 'express';
import { randomUUID } from 'node:crypto';
import { io } from 'socket.io-client';

const PORT = process.env.HARNESS_PORT ? Number(process.env.HARNESS_PORT) : 4500;
const PUBSUB_URL = process.env.PUBSUB_URL ?? 'http://localhost:3000';
const CONNECT_TIMEOUT_MS = 5000;

const sessions = new Map();

const decodeJwtClaims = (token) => {
  const payloadSegment = token.split('.')[1];
  return JSON.parse(Buffer.from(payloadSegment, 'base64url').toString('utf8'));
};

const createSession = (accessToken) =>
  new Promise((resolve, reject) => {
    const socket = io(PUBSUB_URL, {
      transports: ['websocket'],
      extraHeaders: { Cookie: `access_token=${accessToken}` }
    });

    const timeout = setTimeout(() => {
      socket.disconnect();
      reject(new Error(`Timed out connecting to ${PUBSUB_URL}`));
    }, CONNECT_TIMEOUT_MS);

    socket.once('connect', () => {
      clearTimeout(timeout);
      const claims = decodeJwtClaims(accessToken);
      const session = {
        sessionId: randomUUID(),
        userId: claims.sub,
        email: claims.email,
        socket,
        events: [],
        connected: true
      };

      socket.onAny((event, payload) => {
        session.events.push({ event, payload, receivedAt: Date.now() });
        session.onNextEvent?.();
      });

      socket.on('disconnect', () => {
        session.connected = false;
      });

      sessions.set(session.sessionId, session);
      resolve(session);
    });

    socket.once('connect_error', (error) => {
      clearTimeout(timeout);
      socket.disconnect();
      reject(error);
    });
  });

const requireSession = (req, res) => {
  const session = sessions.get(req.params.sessionId);

  if (!session) {
    res.status(404).json({ success: false, error: { message: `Unknown sessionId "${req.params.sessionId}"` } });
    return undefined;
  }

  return session;
};

const app = express();
app.use(express.json());

app.post('/sessions', async (req, res) => {
  const { accessToken } = req.body ?? {};

  if (typeof accessToken !== 'string' || accessToken.length === 0) {
    res.status(400).json({ success: false, error: { message: 'accessToken is required' } });
    return;
  }

  try {
    const session = await createSession(accessToken);
    res.status(201).json({
      success: true,
      data: { sessionId: session.sessionId, userId: session.userId, email: session.email, connected: session.connected }
    });
  } catch (error) {
    res.status(502).json({ success: false, error: { message: error.message } });
  }
});

app.get('/sessions/:sessionId/status', (req, res) => {
  const session = requireSession(req, res);
  if (!session) return;

  res.json({
    success: true,
    data: { sessionId: session.sessionId, userId: session.userId, email: session.email, connected: session.connected }
  });
});

app.post('/sessions/:sessionId/emit', (req, res) => {
  const session = requireSession(req, res);
  if (!session) return;

  const { event, payload } = req.body ?? {};

  if (typeof event !== 'string' || event.length === 0) {
    res.status(400).json({ success: false, error: { message: 'event is required' } });
    return;
  }

  session.socket.emit(event, payload);
  res.json({ success: true, data: { emitted: event, payload: payload ?? null } });
});

app.get('/sessions/:sessionId/events', async (req, res) => {
  const session = requireSession(req, res);
  if (!session) return;

  const waitMs = Math.min(Math.max(Number(req.query.waitMs ?? 2000) || 0, 0), 10000);

  if (session.events.length === 0 && waitMs > 0) {
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, waitMs);
      session.onNextEvent = () => {
        clearTimeout(timer);
        resolve();
      };
    });
    session.onNextEvent = undefined;
  }

  const events = session.events;
  session.events = [];
  res.json({ success: true, data: { events } });
});

app.delete('/sessions/:sessionId', (req, res) => {
  const session = requireSession(req, res);
  if (!session) return;

  session.socket.disconnect();
  sessions.delete(session.sessionId);
  res.json({ success: true, data: { disconnected: true } });
});

app.listen(PORT, () => {
  console.log(`pubsub HTTP test harness listening on http://localhost:${PORT}`);
  console.log(`Proxying Socket.IO sessions to ${PUBSUB_URL}`);
});
