import User from "../models/user.js";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


export const login = async (req, res) => {
  const JWT_KEY = process.env.JWT_KEY;
  const {username, password} = req.body
  
  try {

    const existingUser = await User.findOne({userName: username})
    if (!existingUser) {
      return res.status(401).json({message: 'Invalid credentials'})
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordCorrect) {
      return res.status(401).json({message: 'Invalid credentials'})
    }
    

    const token = jwt.sign({username: existingUser.userName, id: existingUser._id}, JWT_KEY, {expiresIn: '72h'});


    res.status(200).json({
      _id: existingUser._id,
      token: token,
    })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};