import User from '../models/User.js'

// Create new User
export const createUser = async (req, res) => {
   const existingUser = await User.findOne({ username: req.body.username });
   if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists!' });
   }

   const newUser = new User(req.body)

   try {
      const savedUser = await newUser.save()
      res.status(200).json({ success: true, message: 'Successfully created', data: savedUser })
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create. Try again!' })
   }
}

// Get All Users (for testing)
export const getAllUsers = async (req, res) => {
   try {
      const users = await User.find({});
      res.status(200).json({ success: true, message: 'Successfully retrieved users', data: users });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to retrieve users.' });
   }
}

// Delete All Users
export const deleteAllUsers = async (req, res) => {
   try {
      await User.deleteMany({});
      res.status(200).json({ success: true, message: 'All users have been deleted.' });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete users.' });
   }
}

// Update User
export const updateUser = async (req, res) => {
   const id = req.params.id

   try {
      const updatedUser = await User.findByIdAndUpdate(id, {
         $set: req.body
      }, { new: true })

      res.status(200).json({ success: true, message: 'Successfully updated', data: updatedUser })
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to update' })
   }
}

// Delete User
export const deleteUser = async (req, res) => {
   const id = req.params.id

   try {
      await User.findByIdAndDelete(id)

      res.status(200).json({ success: true, message: 'Successfully deleted' })
   } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to delete' })
   }
}

// Get single User
export const getSingleUser = async (req, res) => {
   const id = req.params.id

   try {
      const user = await User.findById(id)

      res.status(200).json({ success: true, message: 'Successfully', data: user })
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' })
   }
}

// Get All Users
export const getAllUser = async (req, res) => {
   try {
      const users = await User.find({})
      res.status(200).json({ success: true, message: 'Successfully', data: users })
   } catch (error) {
      res.status(404).json({ success: false, message: 'Not Found' })
   }
}
