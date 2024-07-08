export const keepWSAlive = (ws: WebSocket, interval = 20000) => {
  return setInterval(() => {
    ws.send('');
  }, interval);
};
