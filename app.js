//모듈을 추출합니다  require 뜻은 필요하다 아마 요구하다인듯
var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var ejs = require('ejs');
var fs = require('fs');

// 웹 서버를 생성합니다
var app = express();
app.use(express.static('public'));

//웹 서버를 실행합니다
var server = http.createServer(app);
server.listen(80,"https://haha13245multipaint2021.netlify.app/", function(){
	console.log('server running at http://127.0.0.1:52273');
});

//라우트를 수행합니다 라우트 = 길 라우팅 = 길찾기 길을 수행한다는게 무슨 뜻이지 아 길을 설정해두는건가보다
app.get('/',function(request,response){
	fs.readFile('Lobby.html',function(error,data){
		response.send(data.toString());
	});
});

app.get('/canvas/:room',function(request,response){
	fs.readFile('Canvas.html','utf8',function(error,data){
		response.send(ejs.render(data,{
			room: request.params.room
		}));
	});
});

app.get('/room',function(request,response){
	var rooms = Object.keys(io.sockets.adapter.rooms).filter(function(item){
		return item.indexOf('/')<0;
	})
  response.send(rooms);
});
var imageData;
// 소켓 서버를 생성합니다
var io = socketio.listen(server);
io.sockets.on('connection',function(socket){
	var roomId = "";
	socket.emit('setup', imageData);
	
	socket.on('join',function(data){
		socket.join(data);
		roomId = data;
	});

	socket.on('draw',function(data){
		io.sockets.in(roomId).emit('line',data);
		imageData = data.imageData;
	});
	socket.on('create_room',function(data){
		io.sockets.emit('create_room',data.toString());
		
	});
	 // Users modified image, let's save it
	 socket.on('save-data', function (data) {
        imageData = data;
    });
});