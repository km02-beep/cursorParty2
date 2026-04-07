const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public')); // 讓瀏覽器可以讀取 public 資料夾的東西

io.on('connection', (socket) => {
    console.log('新用戶連線:', socket.id);

    // 為每個新連線的人隨機分配一個顏色
    const userColor = `hsl(${Math.random() * 360}, 70%, 60%)`;

    // 接收某人的座標，並「廣播」給其他人
    socket.on('cursor-move', (data) => {
        socket.broadcast.emit('cursor-update', {
            id: socket.id,
            x: data.x,
            y: data.y,
            color: userColor
        });
    });

    socket.on('disconnect', () => {
        io.emit('user-left', socket.id);
        console.log('用戶離開:', socket.id);
    });
});


server.listen(3000, () => {
    console.log('伺服器啟動在 http://localhost:3000');
});
