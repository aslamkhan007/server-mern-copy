const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
// dotenv.config({ path: "./config.env" });

const authenticate = async (req, res, next) => {
  try {
    
    debugger;
    const token =   req.cookies.jwtoken;
    console.log('hi');
    console.log(token)
   
   // const varifying =  await jwt.verify(token, "mynameisvinodthapahowareyouvinodthapawhatareyoudoing");
     const varifying =  await jwt.verify(token, process.env.SECRET_KEY);
  
    console.log(varifying._id)
    const rootUser = await User.findOne({
      _id:varifying._id,
      "tokens.token": token,
    });
    console.log(rootUser)

    if (!rootUser) {
      throw new Error("user Error");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (err) {
    res.status(401).send("unauthorized token");
     console.log(err);
  }
};

module.exports = authenticate;
