const mongoose = require("mongoose");
const express = require("express");
const { User, Course, Admin, Room, Message, Video } = require("../db");
const jwt = require("jsonwebtoken");
const {
  authenticateJwt,
  authenticateJwtUsers,
  SECRETKEY,
  UserSecretKey,
} = require("../middleware/auth");

const { GenerateJwt } = require("../middleware/generate");

const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Admin routes

router.post("/signup", async (req, res) => {
  // logic to sign up admin

  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin) {
    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    const token = GenerateJwt({ username, role: "admin" }, SECRETKEY);
    res.status(200).send({ message: "Admin created successfully", token });
  } else {
    res.status(404).send("username exists");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = GenerateJwt({ username, role: "admin" }, SECRETKEY);
    res.json({ message: "logged in succesfully", token });
  } else {
    res.status(403).json({ message: "admin auth failed" });
  }
});

router.get("/me", authenticateJwt, async (req, res) => {
  const admin = await Admin.findOne({ username: req.user.username });
  if (!admin) {
    res.status(403).json({ msg: "Admin doesnt exist" });
  }
  res.json({
    username: admin.username,
  });
});

router.post("/courses", authenticateJwt, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  await course.save();
  const OUTPUT = {
    message: "Course created successfully",
    courseId: course.id,
  };

  res.status(200).json(OUTPUT);
});

router.put("/courses/:courseId", authenticateJwt, async (req, res) => {
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

router.get("/courses", authenticateJwt, async (req, res) => {
  const courses = await Course.find({ postedBy: req.user.username });
  res.status(200).json({ courses: courses });
});

router.get("/chat/:roomId", authenticateJwt, async (req, res) => {
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

router.post("/chat/:roomId", authenticateJwt, async (req, res) => {
  const admin = await Admin.findOne({ username: req.user.username });
  if (!admin) {
    res.status(404).send("user not found");
  } else {
    const room = await Room.findOne({ classroom: req.params.roomId });
    if (!room) {
      res.status(404).json({ msg: "room not found" });
    } else {
      const message = new Message(req.body);
      message.save();
      room.messages.push(message);
      await room.save();
      res.status(200).json({ msg: "sent succesfully" });
    }
  }
});


router.post(
  "/upload/:courseId",
  authenticateJwt,
  upload.single("video"),
  async (req, res) => {
    try {
      // Handle the uploaded video file (e.g., save metadata in the database)
      const courseId = req.params.courseId;
      const videoFile = req.file;
     // Contains information about the uploaded video
     const title = req.body.title;
     const description = req.body.description;
     const image = req.body.image;
     const thumb = req.body.thumb;

      console.log(videoFile);

      // Check if the course exists
      const course = await Course.findById(courseId);

      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      let Url = `http://localhost:3000/user/get-video/${videoFile.filename}`
     

      // Create a new video document
      const newVideo = new Video({
        courseId: courseId,
        videoUrl: Url, // Store the path to the uploaded video
        title:title,
        description:description,
        image:image,
        thumb:thumb
      });

      // Save the video to the database
      await newVideo.save();

      // Respond with a success message and the created video document
      res.json({ message: "Video uploaded successfully", video: newVideo });
    } catch (error) {
      console.error("Error uploading video:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.get("/course/:courseId", authenticateJwt, async (req, res) => {
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  res.json({ course });
});

module.exports = router;
