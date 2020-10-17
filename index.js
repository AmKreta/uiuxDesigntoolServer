const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', req.headers.origin);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.append('CORS_ORIGIN_ALLOW_ALL', 'True')
    next();
});

const path = require('path');
app.use("/public", express.static(path.resolve(__dirname, 'public')));

const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

const https = require('https').Server(options,app);

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(morgan('dev'));
}

const connectDB = require('./db');
connectDB();


const io = require('socket.io')(https);

var connectedUsers = new Map();
var rooms = new Map();

io.on('connection', function (socket) {
    console.log('connected  ' + socket.id);

    socket.on('disconnect', function () {
        console.log('disconnected ' + socket.id);
        connectedUsers.delete(socket.id);
    });

    socket.on('registerUser', function (data) {
        socket.userId = data.userId;
        connectedUsers.set(socket.id, data.userId);
        /* adding user Id to Socket */
        console.log(connectedUsers);
    });

});


/* socket for project design page  */
const projectDesignIo = io.of('/ProjectDesignPage');
projectDesignIo.on('connection', projectDesignSocketManager = (socket) => {
    console.log(socket.id + ' connected to projectDesignPage');

    socket.on('createRoom', function ({ name, password }) {
        if (name && password && !rooms.has(`room-${name}`)) {
            socket.join("room-" + name);
            socket.emit('roomCreated', `room-${name}`);
            rooms.set("room-" + name, password);
            console.log(rooms);
        }
    });

    socket.on('join-room', (data) => {
        /* socke.id in form Namespace#Id */
        if (data) {
            if (rooms.get(data.roomName) === data.password) {
                console.log(connectedUsers);
                console.log(`${socket.id} joined rooom ${data.roomName}`);
                socket.emit('joined');

                socket.join(data.roomName);

                projectDesignIo.to(data.roomName).emit('newMemberJoined', {
                    socketId: socket.id,
                    userId: connectedUsers.get(socket.id.split('#')[1])
                });
            }
            else {
                socket.emit('failed');
            }
        }
    });

    socket.on('getAvailableRooms', function () {
        socket.emit('availableRooms', io.nsps['/ProjectDesignPage'].adapter.rooms);
        console.log(io.nsps['/ProjectDesignPage'].adapter.rooms);
    });

    socket.on('getRoomInfo', function (data) {
        if (data && socket.adapter.rooms[data]) {
            let result = [];
            Object.keys(socket.adapter.rooms[data]['sockets']).forEach(item => {
                result.push(item.split('#')[1]); //'namesace'+'#'+'socket.id'
            })
            socket.emit('roomInfo', result.map(item => {
                return { socketId: item, userId: connectedUsers.get(item) };
            }));
        }
        console.log(data);
    });

    socket.on('drawing', function ({ room, data }) {
        if (room && data) {
            projectDesignIo.to(room).emit('draw', data);
            console.log(room, data);
        }
    });

    socket.on('addChat', function ({ room, data }) {
        socket.broadcast.to(room).emit('chat', data);
    });

    socket.on('addImportantPoint', function ({ room, data }) {
        socket.broadcast.to(room).emit('importantPoint', data);
    });

    socket.on('video', function ({ room, data }) {
        if (room && data) {
            socket.broadcast.to(room).emit(`${data.userId}VideoData`, { blob: data.blob });
        }
    })
});


const chat = require('./routes/chat/chat');
const user = require('./routes/userInfo/userInfo');
const projects = require('./routes/projects/projects');


app.use('/chat', chat);
app.use('/user', user);
app.use('/projects', projects);

const server = https.listen(process.env.PORT, () => {
    console.log(`app running in ${process.env.NODE_ENV} mode listening to port ${process.env.PORT}`);
});

process.on('unhandledRejection', function (err, promise) {
    console.log('error:-' + err.message);
    server.close(() => process.exit(1));
});

app.get('*', function (req, res) { 
    res.header(200).json({sucess:true});
})
