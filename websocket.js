const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // إرسال رسالة ترحيبية عند الاتصال
    ws.send(JSON.stringify({ type: 'notification', message: 'مرحبًا بك في الدردشة!' }));

    // استقبال الرسائل من العميل
    ws.on('message', (message) => {
        console.log('Received:', message.toString());

        // إرسال الرسالة لجميع العملاء المتصلين
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'message', data: message.toString() }));
            }
        });
    });

    // إغلاق الاتصال
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');