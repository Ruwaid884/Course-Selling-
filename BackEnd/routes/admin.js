const mongoose = require("mongoose");
const express = require('express');
const { User, Course, Admin } = require("../db");
const jwt = require('jsonwebtoken');
const {authenticateJwt,authenticateJwtUsers,SECRETKEY,UserSecretKey} = require("../middleware/auth")

const {GenerateJwt} = require("../middleware/generate");



const router = express.Router();

// Admin routes




router.post('/signup', async (req, res) => {
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
  
  
  
  router.post('/login',async (req, res) => {
    const {username,password} =req.body;
    const admin = await Admin.findOne({username,password});
    if(admin){
      const token = GenerateJwt({username, role:'admin'},SECRETKEY);
      res.json({message:"logged in succesfully",token});
    }
    else{
      res.status(403).json({message: "admin auth failed"});
    }
    
  });
  
  
  router.get("/me", authenticateJwt, async (req, res) => {
    const admin = await Admin.findOne({ username: req.user.username });
    if (!admin) {
      res.status(403).json({msg: "Admin doesnt exist"})
      return
    }
    res.json({
        username: admin.username
    })
});



  router.post('/courses',authenticateJwt, async (req, res) => {
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
  
  router.put('/courses/:courseId',authenticateJwt,async (req, res) => {
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
  
  router.get('/courses',authenticateJwt, async (req, res) => {
    const courses = await Course.find({})
    res.status(200).send({courses});
  });

  router.get('/course/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    res.json({ course });
  });

  module.exports = router