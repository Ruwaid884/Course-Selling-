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
const { dir } = require('console');

const app = express();

app.use(express.json());

app.use(cors());
app.use(bodyParser.json())

app.use("/admin", adminRouter)
app.use("/user", userRouter)
app.get("/attachment/:filename",(req,res)=>{
  const {filename}=req.params;
  const filepath = "http://localhost:3000/api/multimedia/"+filename;
  console.log(filepath);
  res.json({url:filepath});
});

app.get('/api/multimedia/:filename', (req, res) => {
  const { filename } = req.params;
  const fileDirectory = path.join(__dirname,`attachments/`); // Replace 'multimedia' with your directory

  // Construct the full file path
  const filePath = path.join(fileDirectory, filename);
  console.log(fileDirectory);
  console.log(filePath);

  // Determine the content type based on the file extension
  const fileExtension = path.extname(filename).toLowerCase();
  let contentType = '';
  if (fileExtension === '.pdf') {
    contentType = 'application/pdf';
  } else if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
    contentType = 'image/jpeg';
  } else if (fileExtension === '.png') {
    contentType = 'image/png';
  }

  if (contentType) {
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } else {
      res.status(404).send('File not found');
    }
  } else {
    res.status(400).send('Unsupported file type');
  }
});


const server = http.createServer(app);

const io = new Server(server,{
  cors:{
    origin:"http://localhost:5173",
    methods:["GET","POST"]
  }
},{
  maxHttpBufferSize:1e8
});


io.on("connection",(socket)=>{
  socket.on("join_room",(data)=>{
    socket.join(data);
  })

  socket.on("send_message",(data)=>{
    socket.to(data.room).emit("receive",data);
  })

  socket.on("attachment",(file,callback)=>{
    console.log(file);
    fs.writeFile(__dirname,file,(err)=>{
      console.log(err);
    })
    socket.to(file.room).emit("receiveAttahment",file);
  });


  socket.on("disconnect",()=>{
     console.log("User Disconnected",socket.id);
  })
})



mongoose.connect('mongodb+srv://ruwaid:ruwaid@cluster0.mlnnycw.mongodb.net/Courses',{useNewUrlParser:true ,useUnifiedTopology: true});



server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
