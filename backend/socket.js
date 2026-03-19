let io;

const initSocket = (server) => {
    const { Server } = require("socket.io");

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("🔌 User connected:", socket.id);

        socket.on("join", (userId) => {
            socket.join(`user_${userId}`);
        });

        socket.on("disconnect", (reason) => {
            // ignore dev hot-reload disconnect spam
            if (reason === "transport close" || reason === "client namespace disconnect") {
                return;
            }
            console.log("❌ User disconnected:", socket.id);
        });
    });
};

const sendRealtimeNotification = (userId, notification) => {
    if (io) {
        io.to(`user_${userId}`).emit("new_notification", notification);
    }
};

module.exports = { initSocket, sendRealtimeNotification };