const mongoose = require('mongoose');

const listschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        maxLength: 200
    },
    image: {
        filename:{
            type:String
        },
        url:{
            type:String,
            default: "https://images.unsplash.com/photo-1728131751556-3694189db906?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1728131751556-3694189db906?q=80&w=1922&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,

        }
        
    },
    price: {
        type: Number,
        min: 1
    },
    location: String,
    country: String
});

const Lists = mongoose.model("List", listschema);

module.exports = Lists;
