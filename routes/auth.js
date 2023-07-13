const express = require ('express');
const router = express.Router();
const { validationResult, body } = require('express-validator');
const User= require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtt = 'Blessyou@123';

router.post('/signup',[
    body('username').isLength({min:4}),
    body('email', 'enter a valid email').isEmail(),
    body('password').isLength({ min: 10 }), 
    body('firstName').isLength({min:3}),
    body('lastName').isLength({min:3}),
    body('vehicleRegNo').isLength({min:3}),
    body('contactNumber').isLength({min:10}),
    body('emergencyContactNumber').isLength({min:10}),
    body('gender').isLength({min:3}),
    body('vehicleType').isLength({min:3})
  ], 
 async (req, res)=> {
  let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); 
    }

    // Handle the case when there are no validation errors
  //we are checking whether the user already exists with the same email or not
    try{
let user = await User.findOne({email:req.body.email});
if(user){
  let success = false;
    return res.status(400).json({error:"sorry enter another email"})
}
//securing password
const salt = await bcrypt.genSaltSync(10);
const secPass= await bcrypt.hash(req.body.password,salt);


  //create a new user
  user = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    vehicleRegNo: req.body.vehicleRegNo,
    contactNumber: req.body.contactNumber,
    emergencyContactNumber: req.body.emergencyContactNumber,
    gender: req.body.gender,
    vehicleType: req.body.vehicleType
  });

//generate jwt token
const data={
    user:{
        id:user.id
    }
}

const token = jwt.sign(data, jwtt);
success = true;
        res.json({success, token})}
        
catch (error){
            console.error (error.message);
            res.status(500).send('invalid value, please try again');
        }
})


//api/auth/login
router.post('/login',[
  body('email', 'enter a valid email').isEmail(),
  body('password', 'password cannot be blank').exists(), ],
async (req, res)=> {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() }); 
  }


  const {email, password}= req.body;
  try{
let user = await User.findOne({email});
if(!user){
  let success = false;
  return res.status(400).json({error:"sorry enter correct email"});
}
//check password
const passwordCompare = await bcrypt.compare(password, user.password);
if (!passwordCompare) {
  let success = false;
  return res.status(400).json({error: "Please try to login with correct credentials" });
}

//generate jwt token
const data={
  user:{
      id:user.id
  }
}

const token = jwt.sign(data, jwtt);
success = true;
res.json({ success, token})}
    
catch (error){
          console.error (error.message);
          res.status(500).send('invalid value, please try again');
      }
})


   

    


module.exports = router;
