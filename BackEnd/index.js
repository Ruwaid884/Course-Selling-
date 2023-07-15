const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');

//app.use(express.json());
app.use(bodyParser.json())


const SECRETKEY = "h33loFromRu";
const UserSecretKey = "infinity";

const userSchema = new mongoose.Schema({
  username:{type: String}, // both are same as for the password and the username
  password:String,
  purchasedCourses: [{type:mongoose.Schema.Types.ObjectId,ref:'Course'}] //we are stating that the schema for this is the type of the id whose ref is something in the Course
});


const adminSchema = new mongoose.Schema({
  username:String,
  password:String
});

const courseSchema = new mongoose.Schema({
  title:String,
  description:String,
  price:Number,
  imageLink:String,
  published:Boolean
});


const User = mongoose.model('User',userSchema);
const Admin = mongoose.model('Admin',adminSchema);
const Course = mongoose.model('Course',courseSchema);

mongoose.connect('mongodb+srv://ruwaid:ruwaid@cluster0.mlnnycw.mongodb.net/Courses',{useNewUrlParser:true ,useUnifiedTopology: true});


const GenerateJwt = (user,secretkey)=>{
const payload = {username: user.username};
return jwt.sign(payload,secretkey,{expiresIn:'1h'});
};

const authenticateJwt = (req,res,next)=>{
  const authhead = req.headers.authorization;
  if(authhead){
    const token = authhead.split(' ')[1];
    jwt.verify(token,SECRETKEY,(err,user)=>
    {
      if(err) return res.sendStatus(403);
      req.user = user;  
      next();
    }
    
    )

  }
  else{
    res.sendStatus(401);
  }
}

const authenticateJwtUsers = (req,res,next)=>{
  const authhead = req.headers.authorization;
  if(authhead){
    const token = authhead.split(' ')[1];
    jwt.verify(token,UserSecretKey,(err,user)=>
    {
      if(err) return res.sendStatus(403);
      req.user = user;  
      next();
    }
    
    )

  }
  else{
    res.sendStatus(401);
  }
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin

  const {username,password} = req.body;
  const admin = await Admin.findOne({username})
  if(!admin){
   
    const newAdmin = new Admin({username,password});
    await newAdmin.save();
  
    const token = GenerateJwt({username,role:'admin'},SECRETKEY);
    res.status(200).send({message: "Admin created successfully",token});

  }
  else{
    res.status(404).send("username exists")
  }
  


  
});

app.post('/admin/login',async (req, res) => {
  const {username,password} =req.headers;
  const admin = await Admin.findOne({username,password});
  if(admin){
    const token = GenerateJwt({username, role:'admin'},SECRETKEY);
    res.json({message:"logged in succesfully",token});
  }
  else{
    res.status(403).json({message: "admin auth failed"});
  }
  
});

app.post('/admin/courses',authenticateJwt, async (req, res) => {
  // logic to create a course
  const course  = new Course(req.body);
      await course.save();
      const OUTPUT = {
        message: "Course created successfully",
        courseId:course.id
      }

      res.status(200).json(OUTPUT);
    

    
  }
);

app.put('/admin/courses/:courseId',authenticateJwt,async (req, res) => {
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

app.get('/admin/courses',authenticateJwt, async (req, res) => {
  const courses = await Course.find({})
  res.status(200).send({courses});
});

// User routes
app.post('/users/signup',async (req, res) => {
  // logic to sign up user
  const {username,password} = req.body;
  const user = await User.findOne({username});
  if(!user){
   
    const newUser = new User({username,password});
    await newUser.save();


    const token = GenerateJwt({username, role: 'user'},UserSecretKey);
    res.status(200).json({message: "User created Successfully",token});

  }

  else{
    res.status(404).send("Username exists");
  }



});

app.post('/users/login', async(req, res) => {
  // logic to log in user
   const {username,password} =req.headers;
  
   const user = await User.findOne({username,password});
   
   if(user){

    const token = GenerateJwt({username,role:'user'},UserSecretKey);
    
    res.status(200).json({message:"Logged in successfully",token});
    
   }
   else{
    res.status(403).json({message:'admin auth failed'})
   }

});

app.get('/users/courses',authenticateJwtUsers, async(req, res) => {
  // logic to list all courses
  const courses = await Course.find({published:true});

  res.status(200).json({courses});
  
});

app.post('/users/courses/:courseId',authenticateJwtUsers,async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
      if(!course){
       res.status(404).send("error finding in the course")
      }
      else{

      const user = await User.findOne({username:req.user.username});

        if(user){

          const index = await user.purchasedCourses.indexOf(req.params.courseId);
          if(index===-1){
          user.purchasedCourses.push(course);
          await user.save();
          res.json({message: 'Course purchased Successfully'});
          }
          else{
  
            res.status(404).json({message:'Course already purchased'});
          }
        }
        else{
          res.status(404).json({message: 'User not found'});
        }
       
      }
      }
      
      
    );

app.get('/users/purchasedCourses',authenticateJwtUsers, async(req, res) => {

const user = await User.findOne({username: req.user.username}).populate('purchasedCourses');
if(user){
  res.json({purchasedCourses: user.purchasedCourses || []})
}
else{
  res.status(403).json({message: 'User not found'});
}

});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
