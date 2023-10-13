const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path')
const fs = require('fs')
const {Server} = require("socket.io");
const cors = require('cors');
const bodyParser = require('body-parser');


const { User, Course, Admin} = require("./db");

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");

const app = express();

app.use(express.json());

app.use(cors());
app.use(bodyParser.json())

app.use("/admin", adminRouter)
app.use("/user", userRouter)

const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"]
  }
});


io.on("connection",(socket)=>{
  console.log(socket.id);

  socket.on("join_room",(data)=>{
    socket.join(data);
    console.log(`user with id: ${socket.id} joined room ${data}`);
  })

  socket.on("send_message",(data)=>{
    socket.to(data.room).emit("receive",data);
  })


  socket.on("disconnect",()=>{
     console.log("User Disconnected",socket.id);
  })
})



mongoose.connect('mongodb+srv://ruwaid:ruwaid@cluster0.mlnnycw.mongodb.net/Courses',{useNewUrlParser:true ,useUnifiedTopology: true});



server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
