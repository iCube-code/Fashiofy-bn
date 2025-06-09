const mongoose = require('mongoose');



const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    brand:{
        type:String,
        required:true,
        trim:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true
    },
    originalPrice:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    size:{
        type:String,
        required:true,
        trim:true
    },
    stock:{
        type:Number,
        required:true, 
    },
    fk_user_id:{
        ref:"User",
        type:mongoose.Schema.Types.ObjectId
    }

},{timestamps:true});


const Product = mongoose.model("Product",productSchema);
module.exports = Product