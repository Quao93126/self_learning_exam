import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique IDs
import { Request, Response } from "express"; // Import Request and Response types
import bcrypt from 'bcrypt';  // Import bcrypt for hashing passwords
import jwt from 'jsonwebtoken'; // Import jwt for creating JSON Web Tokens 
import User from "../model/user-model"; // Import the User model
import config from '../config/config'; // Import configuration settings

// Controller to handle GET requests for all users
async function getUserController (req: Request, res: Response): Promise<Response> {
    try {
        // Fetch all users from the database
        const users = await User.find();
        // Check if users were found
        if(!users || users.length === 0) {
            throw new Error('Can not get the users...')
        }
        // Return the users with a success message
        return res.status(200).json({
            success: true,
            message: 'successfully get the users from the database!',
            data: users
        })
    } catch (error) {
        // Log and return error if fetching users fails
        console.log('error', error);
        return res.status(500).json({
            success: false,
            message: 'unable to get the data from database!',
            data: error
        })        
    }
}

// Controller to handle GET requests for a user by ID
async function getByIdUserController(req: Request, res: Response): Promise<Response> {
    try {
        // Extract user ID from request parameters
        const { id } = req.params;           
        // Find a user by ID
        const user = await User.findOne({ id });
        
        // Check if user was found
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'user is not found!',
                data: user
            });
        }

        // Return the user with a success message
        return res.status(200).json({
            success: true,
            message: 'successfully get the user from the database',
            data: user
        });
    } catch (error) {
        // Log and return error if fetching user fails
        console.log('error', error);
        return res.status(500).json({
            success: false,
            message: 'unable to get the user from the database',
            data: error
        });
    }
}

// Controller to handle POST requests for user registration
async function registerUserController(req: Request, res: Response): Promise<Response> {
    try {
        // Extract user details from the request body
        const { name, age, phone, username, password } = req.body;

        // Check if all required fields are provided
        if (!name || !age || !phone || !username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields.',
            });
        }

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Username is already taken. Please choose a different one.',
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create a new user with the provided details
        const user = new User({
            id: uuidv4(), // Generate a unique ID
            name,
            age,
            phone,
            username,
            password: hashPassword,
            progress: {
                foundation: 0,
                beginner: 0,
                intermediate: 0,
                advance: 0,
                total: 0, 
            },
        });

        // Update the total progress
        user.progress.total = user.progress.foundation + user.progress.beginner +
                              user.progress.intermediate + user.progress.advance;
        
        // Save the new user to the database
        await user.save();

        // Return a success message with the created user data
        return res.status(201).json({
            success: true,
            message: 'User successfully registered...',
            data: user,
        });
    } catch (error) {
        // Log and return error if user registration fails
        console.error('Error registering user:', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to create the user',
            data: error,
        });
    }
}

// Controller to handle POST requests for user login
async function loginUserController(req: Request, res: Response): Promise<Response> {
    try {
        // Extract username and password from the request body
        const { username, password } = req.body;

        // Check if both username and password are provided
        if(!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both username and password.',
            });
        }

        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        // Check if password matches
        if(!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Your password is incorrect',
            });
        }

        // Create a JWT token
        const token = jwt.sign({ userId: user.id }, config.jwtSecretToken, { expiresIn: '24h' });

        // Return the token with a success message
        return res.status(200).json({
            success: true,
            message: 'Successfully logged in...',
            data: `Bearer ${token}`
        });
    } catch (error) {
        // Log and return error if login fails
        console.log('error', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to log in',
            data: error
        });
    }
}

// Controller to handle PUT requests for updating a user
async function updateUserController(req: Request, res: Response): Promise<Response> {
    try {
        // Extract user ID from request parameters
        const { id } = req.params;

        // Update the user with the provided data
        const updatedUser = await User.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true, runValidators: true }
        );

        // Check if user was found and updated
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            });
        }

        // Update the total progress
        updatedUser.progress.total = updatedUser.progress.foundation + 
                                     updatedUser.progress.beginner +
                                     updatedUser.progress.intermediate +
                                     updatedUser.progress.advance;
        
        // Save the updated user to the database
        await updatedUser.save();

        // Return a success message with the updated user data
        return res.status(200).json({
            success: true,
            message: 'User successfully updated.',
            data: updatedUser,
        });
    } catch (error: any) {
        // Log error and handle specific duplicate key error
        console.error('Error updating user:', error);
        if (error.code === 11000 && error.codeName === 'DuplicateKey') {
            return res.status(400).json({
                success: false,
                message: 'Duplicate key error. The provided phone number or email is already in use.',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Unable to update the user',
            data: error,
        });
    }
}

// Controller to handle DELETE requests for deleting a user
async function deleteUserController(req: Request, res: Response): Promise<Response> {
    try {
        // Extract user ID from request parameters
        const { id } = req.params;

        // Find and delete the user by ID
        const user = await User.findOneAndDelete({ id });
        
        // Check if user was found and deleted
        if(!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found!',
            });
        }

        // Return a success message with the deleted user data
        return res.status(200).json({
            success: true,
            message: 'User successfully deleted.',
            data: user
        });
    } catch (error) {
        // Log and return error if deleting user fails
        console.log('error', error);
        return res.status(500).json({
            success: false,
            message: 'Unable to delete the user',
            data: error
        });
    }
}

export {
    getUserController,
    getByIdUserController,
    registerUserController,
    loginUserController,
    updateUserController,
    deleteUserController
};
