require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const http       = require('http');
const { Server } = require('socket.io');
const connectDB  = require('./db');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: '*' } });

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tables',       require('./routes/tables'));
app.use('/api/menu',         require('./routes/menu'));
app.use('/api/orders',       require('./routes/orders'));
app.use('/api/rooms',        require('./routes/rooms'));
app.use('/api/bookings',     require('./routes/bookings'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/reviews',      require('./routes/reviews'));

// Make socket.io available inside route files
app.set('io', io);

// Real time connection
io.on('connection', (socket) => {
  console.log('A screen connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('A screen disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});