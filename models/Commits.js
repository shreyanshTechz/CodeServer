const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    User:{
        type:String,
        required:true
    },
    Message:{
        type:String,
        required:true
    },
    Code:{
        type:mongoose.Types.ObjectId,
        required:true
    }
});
const Commits = mongoose.model('Commits', UserSchema);
module.exports.Commits = Commits;