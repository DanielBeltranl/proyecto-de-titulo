const WS_URL = `${globalThis.location.protocol === 'https:' ? 'wss' : 'ws'}://${globalThis.location.host}/ws/notificaciones/`;

let socket: WebSocket | null = null;

export const connectNotifications = (jwt: string, onMessage: (noti: unknown) => void): void => {
  if (socket) { console.log('[NotifWS] ya conectado, skip'); return; }

  console.log('[NotifWS] conectando a', WS_URL);
  socket = new WebSocket(`${WS_URL}?token=${jwt}`);

  socket.onopen = () => console.log('[NotifWS] conexión abierta');

  socket.onmessage = (event) => {
    console.log('[NotifWS] mensaje recibido:', event.data);
    try {
      onMessage(JSON.parse(event.data));
    } catch (e) {
      console.error('[NotifWS] error parseando mensaje:', e);
    }
  };

  socket.onclose = (e) => {
    console.log('[NotifWS] conexión cerrada — code:', e.code, 'reason:', e.reason);
    socket = null;
  };

  socket.onerror = (e) => {
    console.error('[NotifWS] error en socket:', e);
    socket?.close();
  };
};

export const disconnectNotifications = (): void => {
  socket?.close();
  socket = null;
};
