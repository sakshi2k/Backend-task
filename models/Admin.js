const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    userName : {
        type : String,
        required: true,
        trim: true
    },

    caption: {
        type : String,
        trim: true,
        default: 'N/A'
    },
    
    phoneNo: {
        type : Number,
        required: true,
        trim: true
    },
    
    email: {
        type : String,
        required: true,
        trim: true,
        default: 'N/A'
    },
    
    address: {
        type : String,
        trim: true,
        default: 'N/A'
    },
    
    age: {
        required: true,
        type : String,
        trim: true,
        default: 'N/A'
    },
    
    occupation : {
        required: true,
        type : String,
        trim: true,
        default: 'N/A'
    },

    secretToken : {
        type : String,
        default : 'N/A'
    },

    active : {
        type : Boolean,
        default : false
    }

});

module.exports = Admin = mongoose.model("Admin", adminSchema);