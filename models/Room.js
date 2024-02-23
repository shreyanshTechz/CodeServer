const mongoose = require("mongoose")
const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    Users : {
        type: Array,
        default : [],
    },
    Commits:{
        type:Array,
        default:[],
    }
});
const Room = mongoose.model('Room', UserSchema);
module.exports.Room = Room;