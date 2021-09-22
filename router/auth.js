const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
require("../db/conn");
const User = require("../model/userSchema");
const authenticate = require("../middleware/authenticate");

router.get("/", (req, res) => {
  res.send("hello world from the router");
  console.log("hello");
});

// router.post("/register",(req,res)=>{

//     const {name,email,phone,work,password,cpassword} = req.body;

// if(!name || !email || !phone || !work || !password || !cpassword ){
//     return res.status(422).send("please filled the proper form")
// }
// User.findOne({email:email})
// .then((userExist)=>{
//     if(userExist){
//         return res.status(422).json({error:"email already exist"});

//     }

//     const user = new User({name,email,phone,work,password,cpassword});
//     user.save().then(()=>{
//         res.status(201).json({message:"user registered successfully"})
//     }).catch((err)=>{
//         res.status(500).json({error:"failed to registered"});

//     })
// }).catch((err)=>{console.log((err))})

// })

router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(422).send("please filled the proper form");
  }
  try {
    const userExist = await User.findOne({ email: email });
    // console.log(`ye id ${userExist}`)

    if (userExist) {
      return res.status(422).json({ error: "email already exist" });
    } else if (password != cpassword) {
      return res.status(422).json({ error: "password not matching" });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });

      await user.save();
      res.status(201).json({ message: "user registered successfully " });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/signin", async (req, res) => {
  // console.log(req.body);
  // res.json({msg:"awesome"})
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "please filled the data" });
    }

    const userLogin = await User.findOne({ email: email });

    //console.log(userLogin);

    if (userLogin) {
      const isMatch = await bcrypt.compare(password, userLogin.password);

      const token = await userLogin.generateAuthToken();
      console.log(token);

      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!isMatch) {
        res.status(400).json({ error: "invalid credentials " });
      } else {
        res.json({ message: " user signin sucessfully" });
      }
    } else {
      res.status(400).json({ error: "invalid credentials " });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/about", authenticate, (req, res) => {
  console.log("hello about page");
  res.send(req.rootUser);
  // res.send({"hi":"jkh"});
});

router.get("/getData", authenticate, (req, res) => {
  console.log("hello contect page");
  res.send(req.rootUser);
  // res.send({"hi":"jkh"});
});

router.post("/contact", authenticate, async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("error in contect form");
      return res.json({ error: "pls filled the contect form " });
    }
    const userContect = await User.findOne({ _id: req.userID });
    if (userContect) {
      const userMessage = await userContect.addMessage(
        name,
        email,
        phone,
        message
      );
      await userContect.save();
      res.status(201).json({ message: "user contect successfully" });
    }
  } catch (err) {
    console.log(err);
  }
});


router.get("/logout",  (req, res) => {
  console.log("hello logout page");
  res.clearCookie("jwtoken",{path:"/"})
  res.status(200).send("user logout");
 
});

module.exports = router;
