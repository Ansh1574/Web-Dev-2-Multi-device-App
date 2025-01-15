import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema definition
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 1 // Ensure age is positive
    },
    email: {
        type: String,
        required: true,
        unique: true // Ensure emails are unique if provided
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });

// Hash password before saving the user document
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }

    // Hash the password with bcryptjs
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check if the entered password matches the hashed password
userSchema.methods.isPasswordMatch = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Export the model
export default mongoose.model("User", userSchema);
