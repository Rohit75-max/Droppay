module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('⚡ A user connected to the socket');

        // Streamers join a "room" based on their ID
        socket.on('join_stream', (streamerId) => {
            socket.join(streamerId);
            console.log(`📡 Streamer ${streamerId} is now listening for drops.`);
        });

        socket.on('disconnect', () => {
            console.log('❌ User disconnected');
        });
    });
};