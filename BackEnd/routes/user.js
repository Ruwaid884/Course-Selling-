const express = require("express");
const path = require("path");
const fs = require("fs");
const range = require("range-parser");
const Razorpay = require("razorpay");
const KEY_ID = "rzp_test_O6a77B92kQOpHr";
const KEY_SECRET = "ExTahQ5f2P49vuc9YmDckMpK";
const { HmacSHA256 } = require("crypto-js");
const crypto = require("crypto");
const multer = require("multer");


const {
  authenticateJwt,
  authenticateJwtUsers,
  SECRETKEY,
  UserSecretKey,
} = require("../middleware/auth");

const { User, Course, Admin, Room, Message, Video } = require("../db");
const { GenerateJwt } = require("../middleware/generate");

const router = express.Router();

const chatattachement = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./attachments");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const attachmentupload = multer({storage:chatattachement});


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

router.post("/order", authenticateJwtUsers, (req, res) => {
  var instance = new Razorpay({ key_id: KEY_ID, key_secret: KEY_SECRET });

  var options = {
    amount: parseInt(req.body.amount) * 100, // amount in the smallest currency unit
    currency: "INR",
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      return res.send({ code: 500, message: "Server Err." });
    }
    return res.send({ code: 200, message: "order created", data: order });
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
    const room = await Room.findOne({ classroom: req.params.roomId }).populate(
      "messages"
    );

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

router.post("/chat/:roomId", authenticateJwtUsers,attachmentupload.single('attachment'), async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      const room = await Room.findOne({ classroom: req.params.roomId });
      if (!room) {
        res.status(404).json({ msg: "Room not found" });
      } else {
        let url = "";
        if(req.file){
          url = `http://localhost:3000/api/multimedia/${req.file.filename}`
        }
    
        const message = new Message({
          message:req.body.message,
          time: new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
          room:req.body.room,
          sender:req.body.sender,
          attachment:url
        });
        console.log(message.attachment);
       await message.save();
        room.messages.push(message);
        await room.save();
        res.status(200).json({ msg: "sent succesfully" });
      }
    }
  
  }
  catch (error) {
    console.error("/chat/:roomid/ post", error.message);
    res.status(500).json({ msg: "Internal server error" });
  }
  } 
  );

router.post("/verify", authenticateJwtUsers, async (req, res) => {
  try {
    const generated_signature = crypto
      .createHmac("sha256", KEY_SECRET)
      .update(
        req.body.response.razorpay_order_id +
          "|" +
          req.body.response.razorpay_payment_id
      )
      .digest("hex");

    // Replace this with your actual validation logic
    var response = { success: "false" };
    if (req.body.response.razorpay_signature_id === generated_signature)
      response = { success: "true" };
    res.send(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get(
  "/course/content/:courseId",
  authenticateJwtUsers,
  async (req, res) => {
    const courseId = req.params.courseId;

    try {
      const videos = await Video.find({ courseId });

      res.json(videos);
    } catch (error) {
      console.error("Error fetching videos for course:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    }
  }
);


router.get(
  "/videofind/:videoId",
  authenticateJwtUsers,
  async (req, res) => {
    const videoId = req.params.videoId;

    try {
      const video = await Video.findById(videoId);

      res.json(video);
    } catch (error) {
      console.error("Error fetching videos for course:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    }
  }
);


router.get("/get-video/:videoID",async (req, res) => 
  {
    try {
      const { videoID } = req.params;
      console.log(videoID);
      const videoPath = path.join(
        __dirname,
        `../uploads/${videoID}`
      );
      console.log(videoPath);
      const stat = fs.statSync(videoPath);
  
      res.writeHead(200, {
        "Content-Length": stat.size,
        "Content-Type": "video/mp4",
      });
  
      const videoStream = fs.createReadStream(videoPath);
      
      videoStream.pipe(res);
    } catch (error) {
      res.status(500).json(error);
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

router.post(
  "/lookpurchase/:courseId",
  authenticateJwtUsers,
  async (req, res) => {
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
  }
);

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

router.put("/courses/:courseId", authenticateJwtUsers, async (req, res) => {
  // logic to edit a course

  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });

  if (course) {
    const output = {
      message: "Course updated successfully",
    };
    res.status(200).json(output);
  } else {
    res.status(404).json({ message: "course not found" });
  }
});

module.exports = router;
