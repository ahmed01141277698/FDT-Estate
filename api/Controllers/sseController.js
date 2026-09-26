import jwt from "jsonwebtoken";

const clients = new Map();
// register a client to the map of connected clients. The userId is used as the key, and the response object is stored in a set. If the user already has connected clients, the new client is added to the set.
export const registerClient = (userId, res) => {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId).add(res);
};
// remove a client from the map of connected clients. If the user has no more connected clients, remove the user from the map.
export const removeClient = (userId, res) => {
  const set = clients.get(userId);
  if (!set) return;
  set.delete(res);
  if (set.size === 0) clients.delete(userId);
};
// send a notification to a specific user. The payload can be any JSON-serializable object. If the user is not connected, the function will do nothing.
export const sendToUser = (userId, payload) => {
  const set = clients.get(String(userId));
  if (!set || set.size === 0) return;

  const data = `data: ${JSON.stringify(payload)}\n\n`;
  set.forEach((res) => {
    try {
      res.write(data);
    } catch {}
  });
};

// stream notifications to the client using Server-Sent Events (SSE). The client must provide a valid JWT token in the query parameters to authenticate. If the token is valid, the server will keep the connection open and send notifications to the client as they arrive. The server also sends a ping every 25 seconds to keep the connection alive and prevent timeouts. If the client disconnects, the server will clean up and remove the client from the map.
export const streamNotifications = (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(401).end();

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.id;
  } catch {
    return res.status(401).end();
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",

    "X-Accel-Buffering": "no",
  });
  res.flushHeaders?.();
  res.write(": connected\n\n");

  registerClient(String(userId), res);
  // send a ping every 25 seconds to keep the connection alive and prevent timeouts. If the client disconnects, clear the interval and remove the client from the map.
  const heartbeat = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      clearInterval(heartbeat);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);
    removeClient(String(userId), res);
    res.end();
  });
};
