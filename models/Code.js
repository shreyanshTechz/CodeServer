const mongoose = require("mongoose")
const CodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
    },
    user:{
        type:String,
        required:true,
    },
    room:{
        type:String,
        required:true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
const Code = mongoose.model('Codes', CodeSchema);
module.exports.Code = Code;