const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const chatRoutes = require('./routes/chatRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const cors = require('cors'); // Import CORS middleware

dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api/users', userRoutes);
app.use('/api/user-profile', userProfileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chats', chatRoutes);

// Error handling middleware
// app.use(notFound);
// app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, console.log(`Server running on port ${PORT}`));

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// io.on('connection', (socket) => {
//   socket.on('join', (room) => {
//     socket.join(room);
//   });

//   socket.on('leave', (room) => {
//     socket.leave(room);
//   });

//   socket.on('sendMessage', ({ userId, jobId, message }) => {
//     io.to(jobId).emit('message', { user: userId, text: message });
//   });
// });
