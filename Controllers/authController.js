import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// user register
export const register = async (req, res) => {
   try {
      // Check if username already exists
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
         return res.status(400).json({ success: false, message: 'Username already exists!' });
      }

      // Log the request body for debugging
      console.log("Request Body:", req.body);

      // Check if password is provided
      if (!req.body.password) {
         return res.status(400).json({ success: false, message: 'Password is required!' });
      }

      // Hashing password
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(req.body.password, salt)

      const newUser = new User({
         username: req.body.username,
         email: req.body.email,
         password: hash,
         photo: req.body.photo
      })

      await newUser.save()

      res.status(200).json({ success: true, message: "Successfully created!" })
   } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create! Try again." })
      console.log(error)
   }
}

export const getAllUsers = async () => {
    return await User.find({});
}

// user login
export const login = async (req, res) => {
   try {
       const identifier = req.body.email; // This will accept both email and username
       console.log("Attempting to log in with:", identifier);
       
       const user = await User.findOne({
           $or: [{ email: identifier }, { username: identifier }]
       });

       // if user doesn't exist
       if (!user) {
           return res.status(404).json({ success: false, message: 'User not found!' });
       }

       // if user exists then check the password
       const checkCorrectPassword = await bcrypt.compare(req.body.password, user.password);

       // if password incorrect 
       if (!checkCorrectPassword) {
           return res.status(401).json({ success: false, message: "Incorrect email or password!" });
       }

       const { password, role, ...rest } = user._doc;

       // create jwt token
       const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: "15d" });

       // set token in the browser cookies and send the response to the client
       res.cookie('accessToken', token, {
           httpOnly: true,
           expires: token.expiresIn
       }).status(200).json({ token, data: { ...rest }, role });
   } catch (error) {
       res.status(500).json({ success: false, message: "Failed to login" });
   }
}
