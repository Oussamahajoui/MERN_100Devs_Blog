import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://yt3.googleusercontent.com/ytc/AIdro_lxUGMAhM6CuwvwtozPpB1Ohb05G3b12-VBbgDypiK2GA=s900-c-k-c0x00ffffff-no-rj'
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema);

export default User;