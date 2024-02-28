const http = require('http');
const express = require('express');
const app = express();
app.use(express.json())
const cors = require('cors');
const { Server } = require('socket.io');
const server = http.createServer(app);
var compiler = require('compilex');
var mongo = require('mongoose');

var {Code} = require("./models/Code");
mongo.connect("mongodb+srv://shreyanshpec21:D2GxUVICFRD65X0e@twitter.ctdbj78.mongodb.net/?retryWrites=true&w=majority", { dbName: "Collaborate" }).then(() => console.log("connected")).catch((er)=>console.log(er));
var option = {};
app.use(cors());
compiler.init(option);



app.post('/compilecode', function (req, res) {

  var code = req.body.code;
  var input = req.body.input;
  var inputRadio = req.body.inputRadio;
  var lang = req.body.lang;
  if ((lang === "c") || (lang === "cpp")) {
    if (inputRadio === true) {
      let envData = {
        OS: "windows", cmd: "gcc", options: {
          timeout: 0
        }
      };
      compiler.compileCPPWithInput(envData, code, input, function (data) {
        if (data.error) {
          console.log(data.error);

          res.send(data);

        }
        else {
          console.log(data.output);
          res.send(data);
        }
      });
    }
    else {
      console.log(code);
      var envData = {
        OS: "windows", cmd: "g++", options: {
          timeout: 20
        }
      };
      compiler.compileCPP(envData, code, function (data) {
        if (data.error) {
          res.send(data.error);

        }
        else {
          res.send(data);
        }

      });
    }
  }
  if (lang === "java") {
    if (inputRadio === true) {
      var envData = {
        OS: "windows", options: {
          timeout: 0
        }
      };
      console.log(code);
      compiler.compileJavaWithInput(envData, code, function (data) {
        res.send(data);
      });
    }
    else {
      var envData = {
        OS: "windows", options: {
          timeout: 0
        }
      };
      console.log(code);
      compiler.compileJavaWithInput(envData, code, input, function (data) {
        res.send(data);
      });

    }

  }
  if (lang === "python") {
    if (inputRadio === true) {
      var envData = { OS: "windows" };
      compiler.compilePythonWithInput(envData, code, input, function (data) {
        console.log(data);
        res.send(data);
      });
    }
    else {
      var envData = { OS: "windows" };
      compiler.compilePython(envData, code, function (data) {
        console.log(data);
        res.send(data);
      });
    }
  }
  if (lang === "CS") {
    if (inputRadio === true) {
      var envData = { OS: "windows" };
      compiler.compileCSWithInput(envData, code, input, function (data) {
        res.send(data);
      });
    }
    else {
      var envData = { OS: "windows" };
      compiler.compileCS(envData, code, function (data) {
        res.send(data);
      });
    }

  }
  if (lang === "VB") {
    if (inputRadio === true) {
      var envData = { OS: "windows" };
      compiler.compileVBWithInput(envData, code, input, function (data) {
        res.send(data);
      });
    }
    else {
      var envData = { OS: "windows" };
      compiler.compileVB(envData, code, function (data) {
        res.send(data);
      });
    }

  }
  console.log(req.body);
});



const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
app.post('/commitcode',async function(req,res){
  const {code,user,room} = req.body;
  const codes = new Code({code,user,room});
  const result = await codes.save();
  res.send(result.id);
})
app.post('/getcode',async function(req,res) {
  const {id} = req.body;
  console.log(req.body);
  const result = await Code.findById(id);
  res.send(result);
})
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./User');
io.on('connect', socket => {
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name: username, room: room });
    if (error) return callback(error);

    socket.join(user.room);
    io.to(room).emit('message', {
      user: 'adminX',
      text: `${user.name.toUpperCase()} has joined!`,
      time:  new Date().toLocaleTimeString()
    });

    io.to(room).emit('roomData', {
      room: room,
      users: getUsersInRoom(room)
    });

    callback();
  });
  socket.on('messagecode', ({ username, room, userCode }) => {
    io.to(room).emit('messagecode', userCode)
  })

  socket.on('sendMessage', ({ username, room, message,isCommit,id}, callback) => {
    io.to(room).emit('message', { user: username, text: message,isCommit:isCommit,time:new Date().toLocaleTimeString(),id:id});

    callback();
  });
  socket.on('disconnected', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'adminX',
        text: `${user.name.toUpperCase()} has left.`,
        time:  new Date().toLocaleTimeString()
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});
server.listen(4000, () =>
  console.log('Server is running')
);