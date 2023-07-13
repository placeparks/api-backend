const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, minlength: 6 },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    vehicleRegNo: { type: String, required: true },
    contactNumber: { type: String, required: true },
    emergencyContactNumber: { type: String, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    vehicleType: { type: String, required: true }
});

// Hash the password before saving it to the database
UserSchema.pre('save', async function(next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
