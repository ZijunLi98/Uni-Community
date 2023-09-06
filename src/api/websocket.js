export const initWebsocket = (data) => {
  const socket = new WebSocket('wss://47.104.72.151:8089/chat');
  socket.onopen = function () {
    console.log('连接建立成功');
    socket.send(JSON.stringify(data));
  };
  socket.onclose = function (e) {
    console.log(
      'websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean
    );
    console.log(e);
  };

  return socket;
};
