const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
  postedBy: String,
});

const messageSchema = new mongoose.Schema({
  room: { type: String },
  message: String,
  time: String,
  sender:String,
});

const videoSchema = new mongoose.Schema({
  title: String,
  image: String,
  description:String,
  thumb:String,
  videoUrl: String, 
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  playableUrl:String,
});

const roomSchema = new mongoose.Schema({
  classroom: { type: String },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);
const Room = mongoose.model("Room", roomSchema);
const Message = mongoose.model("Message", messageSchema);
const Video = mongoose.model("Video",videoSchema);

module.exports = {
  User,
  Admin,
  Course,
  Room,
  Message,
  Video,
};
