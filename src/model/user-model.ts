import { Schema, model, Document } from "mongoose"; // Importing required modules from mongoose
// Defining the IUser interface which extends Document to include user-related properties
interface IUser extends Document {
    id: string;
    name: string;
    age: number;
    phone: string;
    username: string;
    password: string;
    progress: {
        foundation: number;
        beginner: number;
        intermediate: number;
        advance: number;
        total: number;
    };
    admin: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Creating a schema for the User model
const userSchema = new Schema({
    id: { type: String, required: true }, // User ID, required field
    name: { type: String, required: true }, // User name, required field
    age: { type: Number, required: true }, // User age, required field
    phone: { type: String, required: true }, // User phone number, required field
    username: { type: String, required: true, unique: true }, // User username, required and unique field
    password: { type: String, required: true }, // User password, required field
    progress: {
        foundation: { type: Number, default: 0 }, // Progress in foundation, default is 0
        beginner: { type: Number, default: 0 }, // Progress in beginner level, default is 0
        intermediate: { type: Number, default: 0 }, // Progress in intermediate level, default is 0
        advance: { type: Number, default: 0 }, // Progress in advance level, default is 0
        total: { type: Number, default: 0 }, // Total progress, default is 0
    },
    admin: { type: Boolean, default: false }, // Boolean indicating if the user is an admin, default is false
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    toJSON: { virtuals: true }, // Include virtuals when converting the document to JSON
});
// Virtual property to calculate the total progress
userSchema.virtual('total').get(function(this: { progress: { foundation: number; beginner: number; intermediate: number; advance: number; }; }) {
    return this.progress.foundation + this.progress.beginner + this.progress.intermediate + this.progress.advance;
});
// Pre-save hook to update the total progress before saving the document
userSchema.pre<IUser>('save', async function(next) {
    this.progress.total = this.progress.foundation + this.progress.beginner + this.progress.intermediate + this.progress.advance;
    next(); // Proceed to the next middleware or save operation
});
// Creating the User model from the schema
const User = model<IUser>('User', userSchema);
// Exporting the User model for use in other parts of the application
export default User;
