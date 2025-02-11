# websocket

## 什么是WebSocket？它与HTTP协议有什么区别？
- WebSocket是一种全双工通信协议，允许客户端和服务器之间进行实时数据交换。与HTTP不同，WebSocket在建立连接后可以保持连接，允许双向通信，而HTTP是单向的请求-响应模式。

- 如何实现一个简单的WebSocket连接？如何处理连接断开和重连？
```js
let socket;

function connect() {
    socket = new WebSocket('ws://your-websocket-url');

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
    };

    socket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connect, 1000);
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close();
    };
}

connect();
```

## 在实时应用中（如聊天室或股票行情），如何优化WebSocket的性能和稳定性？
- 使用心跳机制检测连接状态。
- 实现消息队列和批量发送，减少消息频率。
- 使用负载均衡和水平扩展，确保高并发处理能力。
