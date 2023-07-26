const express = require('express');
const {authenticateJwt,authenticateJwtUsers,SECRETKEY,UserSecretKey} = require("../middleware/auth")

const { User, Course, Admin } = require("../db");
const {GenerateJwt} =require("../middleware/generate")


const router = express.Router();




router.post('/signup',async (req, res) => {
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
  
  router.post('/login', async(req, res) => {
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
  
  router.get('/courses',authenticateJwtUsers, async(req, res) => {
    // logic to list all courses
    const courses = await Course.find({published:true});
  
    res.status(200).json({courses});
    
  });
  
  router.post('/courses/:courseId',authenticateJwtUsers,async (req, res) => {
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
  
    router.get('/purchasedCourses',authenticateJwtUsers, async(req, res) => {
  
  const user = await User.findOne({username: req.user.username}).populate('purchasedCourses');
  if(user){
    res.json({purchasedCourses: user.purchasedCourses || []})
  }
  else{
    res.status(403).json({message: 'User not found'});
  }
  
  });

  module.exports = router;