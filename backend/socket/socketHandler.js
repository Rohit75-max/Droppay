module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('⚡ New Connection:', socket.id);

        // 1. DASHBOARD: Streamers join a room to hear live drop events
        socket.on('join_stream', (streamerId) => {
            socket.join(streamerId);
            console.log(`📡 Dashboard joined room: ${streamerId}`);
        });

        // 2. OVERLAY: OBS sources join a private room using their obsKey
        socket.on('join-overlay', (obsKey) => {
            socket.join(obsKey);
            console.log(`📡 Overlay joined private room: ${obsKey}`);
        });

        // 3. STUDIO SYNC: Listen for theme changes from the Control Center
        // This broadcasts new colors/fonts to anyone in the obsKey room
        socket.on('update-theme', (data) => {
            const { obsKey, settings } = data;
            io.to(obsKey).emit('settings-update', settings);
            console.log(`🎨 Theme update broadcasted to overlay: ${obsKey}`);
        });

        // 4. STREAMING SUITE: Professional Broadcasting Controls
        
        // Trigger a specific alert (Replay feature)
        socket.on('trigger-alert', (data) => {
            const { obsKey, eventData } = data;
            io.to(obsKey).emit('new-drop', eventData);
            console.log(`📡 Alert Replay triggered for: ${obsKey}`);
        });

        // Switch Scenes (Dynamic OBS Source)
        socket.on('switch-scene', (data) => {
            const { obsKey, sceneId } = data;
            io.to(obsKey).emit('scene-change', sceneId);
            console.log(`🎬 Scene changed to ${sceneId} for: ${obsKey}`);
        });

        // Studio Hub Real-time Sync (Live feed updates)
        socket.on('studio-ping', (data) => {
            const { streamerId, event } = data;
            io.to(streamerId).emit('studio-event', event);
        });

        socket.on('disconnect', () => {
            console.log('❌ User Disconnected');
        });
    });
};