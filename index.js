const http = require('http');
const express = require('express');
const app = express();
app.use(express.json())
const cors = require('cors');
const { Server } = require('socket.io');
const server = http.createServer(app);
var compiler = require('compilex');
var option = {stats : true,timeout:34354355435};
app.use(cors());
compiler.init(option);
app.post('/compilecode' , function (req , res ) {
    
	  var code = req.body.code;	
	  var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;
    if((lang === "c") || (lang === "cpp"))
    {        
        if(inputRadio === true)
        {    
        	let envData = { OS : "windows" , cmd : "gcc"};	   	
        	compiler.compileCPPWithInput(envData , code ,input , function (data) {
        		console.log(envData,"fewr");
            if(data.error)
        		{
        			console.log(data.error);
              
              res.send(data);  	
              	
        		}
        		else
        		{
              console.log(data.output);
        			res.send(data);
        		}
        	});
	   }
	   else
	   {	
      console.log(code);
      console.log(envData,"fewr");
	   	var envData = { OS : "windows" , cmd : "gcc"}  
        	compiler.compileCPP(envData , code , function (data) {
            if(data.error)
        		{
        			console.log("E",data.error);
              res.send(data.error);  	
              	
        		}
        		else
        		{
              console.log(data.output);
        			res.send(data);
        		}
    
        });
	   }
    }
    if(lang === "java")
    {
        if(inputRadio === true)
        {
            var envData = { OS : "windows"};     
            console.log(code);
            compiler.compileJavaWithInput( envData , code , function(data){
                res.send(data);
            });
        }
        else
        {
            var envData = { OS : "windows" };     
            console.log(code);
            compiler.compileJavaWithInput( envData , code , input ,  function(data){
                res.send(data);
            });

        }

    }
    if( lang === "python")
    {
        if(inputRadio === true)
        {
            var envData = { OS : "windows"};
            compiler.compilePythonWithInput(envData , code , input , function(data){
              console.log(data);
                res.send(data);
            });            
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compilePython(envData , code , function(data){
              console.log(data);
                res.send(data);
            });
        }
    }
    if( lang === "CS")
    {
        if(inputRadio === true)
        {
            var envData = { OS : "windows"};
            compiler.compileCSWithInput(envData , code , input , function(data){
                res.send(data);
            });            
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compileCS(envData , code , function(data){
                res.send(data);
            });
        }

    }
    if( lang === "VB")
    {
        if(inputRadio === true)
        {
            var envData = { OS : "windows"};
            compiler.compileVBWithInput(envData , code , input , function(data){
                res.send(data);
            });            
        }
        else
        {
            var envData = { OS : "windows"};
            compiler.compileVB(envData , code , function(data){
                res.send(data);
            });
        }

    }
  console.log(req.body);
});

app.get('/fullStat' , function(req , res ){
    compiler.fullStat(function(data){
        res.send(data);
    });
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./User');
io.on('connect', socket => {
  socket.on('join', ({ username, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name: username, room:room }); // add user with socket id and room info
    console.log(user);
    if (error) return callback(error);

    socket.join(user.room);

    io.to(room).emit('message', {
      user: 'adminX',
      text: `${user.name.toUpperCase()}, Welcome to ${room} room.`
    });
    io.to(room).emit('message', {
      user: 'adminX',
      text: `${user.name.toUpperCase()} has joined!`
    });

    io.to(room).emit('roomData', {
      room: room,
      users: getUsersInRoom(room) 
    });

    callback();
  });
socket.on('messagecode', ({ username, room,userCode}) => {
    io.to(room).emit('messagecode', userCode)
})

socket.on('sendMessage', ({ username, room,message}, callback) => {
  console.log(username);
  io.to(room).emit('message', { user: username, text: message });

  callback();
});
socket.on('disconnected', () => {
  const user = removeUser(socket.id);

  if (user) {
    io.to(user.room).emit('message', {
      user: 'adminX',
      text: `${user.name.toUpperCase()} has left.`
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