const express = require("express");
const path = require('path');
const fs = require('fs');
const range = require('range-parser');
const Razorpay = require('razorpay');
const KEY_ID ='rzp_test_O6a77B92kQOpHr';
const KEY_SECRET = 'ExTahQ5f2P49vuc9YmDckMpK'
const { HmacSHA256 } = require('crypto-js');
const crypto = require('crypto'); 


const {
  authenticateJwt,
  authenticateJwtUsers,
  SECRETKEY,
  UserSecretKey,
} = require("../middleware/auth");

const { User, Course, Admin, Room, Message, Video } = require("../db");
const { GenerateJwt } = require("../middleware/generate");

const router = express.Router();

router.post("/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    const newUser = new User({ username, password });
    await newUser.save();

    const token = GenerateJwt({ username, role: "user" }, UserSecretKey);
    res.status(200).json({ message: "User created Successfully", token });
  } else {
    res.status(404).send("Username exists");
  }
});


router.post("/order",authenticateJwtUsers,(req,res)=>{
  
var instance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET })

var options = {
  amount: parseInt(req.body.amount)*100,  // amount in the smallest currency unit
  currency: "INR",
};
instance.orders.create(options, function(err, order) {
  if(err){
    return res.send({code:500, message:'Server Err.'})
  }
  return res.send({code:200,message: 'order created',data: order});
});
});


router.post("/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });

  if (user) {
    const token = GenerateJwt({ username, role: "user" }, UserSecretKey);

    res.status(200).json({ message: "Logged in successfully", token });
  } else {
    res.status(400).json({ message: "admin auth failed" });
  }
});

router.get("/courses", authenticateJwtUsers, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });

  res.status(200).json({ courses });
});

router.get("/me", authenticateJwtUsers, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (user) {
    res.status(200).json({ username: user.username });
  } else res.status(403).json({ message: "user not found" });
});

router.get("/chat/:roomId", authenticateJwtUsers, async (req, res) => {
  try {
    const room = await Room.findOne({ classroom: req.params.roomId }).populate("messages");

    if (room) {
      res.json({ messages: room.messages || [] });
    } else {
      // Room doesn't exist, create a new one
      const newRoom = new Room({
        classroom: req.params.roomId,
        messages: [],
      });
      await newRoom.save();
      res.status(200).json({ message: "success" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/chat/:roomId", authenticateJwtUsers, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      const room = await Room.findOne({ classroom: req.params.roomId });
      if (!room) {
        res.status(404).json({ msg: "Room not found" });
      } else {
        const message = new Message(req.body);
        message.save();
        room.messages.push(message);

        // Save the updated room with the new message
        await room.save();
        
        res.status(200).json({ msg: "Message sent successfully" });
      }
    }
  } catch (error) {
    console.error('/chat/:roomid/ post', error.message);
    res.status(500).json({ msg: "Internal server error" });
  }  
});


router.post('/verify', authenticateJwtUsers, async (req, res) => {
  try {
    const generated_signature = crypto
      .createHmac('sha256', KEY_SECRET)
      .update(req.body.response.razorpay_order_id + '|' + req.body.response.razorpay_payment_id)
      .digest('hex');

    // Replace this with your actual validation logic
    var response = {"success":"false"}
    if (req.body.response.razorpay_signature_id === generated_signature) 
      response ={"success":"true"}
    res.send(response);
     
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




router.get("/course/content/:courseId",authenticateJwtUsers,async(req,res)=>{
  const courseId = req.params.courseId;

  try {
    const videos = await Video.find({ courseId });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos for course:', error.message); 
    res.status(500).json({ error: 'Internal server error', message: error.message }); 
  }
});
router.get("/course/video/:videoId",authenticateJwtUsers,async(req,res)=>{
  const Id = req.params.videoId;
  try{
    const video = await Video.findById(Id);
    console.log(video);
    if (!video) {
      return res.status(404).send('Video not found');
    }
    console.log(__dirname);
    const videoPath = path.join(__dirname, '..', video.videoUrl); // Adjust the path as needed
    console.log(videoPath);

    // Check if the video file exists
    if (!fs.existsSync(videoPath)) {
      return res.status(404).send('Video file not found');
    }

    const videostat = fs.statSync(videoPath);
    const fileSize = videostat.size;
    const videoRange = req.headers.range;


    if(videoRange){
      const parts = videoRange.replace(/bytes=/,"").split("-");

      const start = parseInt(parts[0],10);

      const end = parts[1] ? parseInt(parts[1],10): fileSize-1;

      const chunksize = (end-start) +1;
      const file = fs.createReadStream(videoPath,{start,end});

      const header = {

        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        
        'Accept-Ranges': 'bytes',
        
        'Content-Length': chunksize,
        
        'Content-Type': 'video/mp4',
        
        };
        res.writeHead(206,head);

        file.pipe(res);
        }

        else {

          const head = {
          
          'Content-Length': fileSize,
          
          'Content-Type': 'video/mp4',
          
          };
          
          res.writeHead(200, head);
          
          fs.createReadStream(videoPath).pipe(res);
          
          }
        }
        catch (error) {
          console.error('Error fetching videos for course:', error.message); 
          res.status(500).json({ error: 'Internal server error', message: error.message }); 
        }
          
          });

router.post("/courses/:courseId", authenticateJwtUsers, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404).send("error finding in the course");
  } else {
    const user = await User.findOne({ username: req.user.username });

    if (user) {
      const index = await user.purchasedCourses.indexOf(req.params.courseId);
      if (index === -1) {
        user.purchasedCourses.push(course);
        await user.save();
        res.json({ message: "True" });
      } else {
        res.status(404).json({ message: "False" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
});

router.post("/lookpurchase/:courseId", authenticateJwtUsers, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404).send("error finding in the course");
  } else {
    const user = await User.findOne({ username: req.user.username });

    if (user) {
      const index = await user.purchasedCourses.indexOf(req.params.courseId);
      if (index === -1) {
        res.json({ message: "True" });
      } else {
        res.status(404).json({ message: "False" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  }
});

router.get("/purchasedCourses", authenticateJwtUsers, async (req, res) => {
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

router.get("/me", authenticateJwtUsers, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (!user) {
    res.status(403).json({ msg: "user doesnt exist" });
  }
  res.json({
    username: user.username,
  });
});




router.put('/courses/:courseId',authenticateJwtUsers,async (req, res) => {
  // logic to edit a course

  const course = await Course.findByIdAndUpdate(req.params.courseId,req.body,{new:true});

      if(course){
        const output = {
              message: "Course updated successfully"
            }
            res.status(200).json(output);
      }
      else{
        res.status(404).json({message: 'course not found'});
      }
        
      }

);

module.exports = router;
