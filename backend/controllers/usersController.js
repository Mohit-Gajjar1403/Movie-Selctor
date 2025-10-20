const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
async function registerUser(req, res) {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }
    const user = new User({ username, password, role });
    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function loginUser (req, res) {

    try {
    let username;
    let password;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Basic ")) {
      const base64Credentials = authHeader.split(" ")[1];
      const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
      [username, password] = credentials.split(":");
    } 
    else {
      username = req.body.username;
      password = req.body.password;
    }
    console.log(username,password);
    if (!username || !password) {
      return res.status(400).json({ msg: "Username and password are required" });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }
    console.log("Password from request:", password);
    console.log("Password from DB:", user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Compare result:", isMatch);

    if (!isMatch) {
    console.log(username,password,isMatch);
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({user,password, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function deleteUser(req,res)
{
  try{
    const {userId}=req.params;
    const check=await User.findById(req.user.id);
    if(check.role!=="admin"){
      return res.status(403).json({msg:"not authorized"});
    }
    const user=await User.findById(userId);
    if(!user)
      return res.status(404).json({msg:"user not found"});
    await user.deleteOne();
    res.status(200).json({msg:"user deleted successfully"});
  }
  catch(err)
  {
    return res.status(500).json({error:err.message});
  }
}
async function findUserById(req, res) {
  try {
    if(req.user.role!=='admin')
    {
      return res.status(403).json({msg:"not authorized"});
    }
    const user = await User.findById(req.params.id); // await here
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
}

module.exports = { registerUser ,loginUser,deleteUser,findUserById};
