const mongoose = require("mongoose");

const trainerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please add a name"]
    },
    username: {
        type: String,
        required: [true, "please add a username"]
    },
    email: {
        type: String,
        required: [true, "please add an email"]
    },
    password: {
        type: String,
        required: [true, "please add a password"]
    },
    about: {
        type: String,
        required: [true, "please add a about"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.models.Trainer || mongoose.model("Trainer", trainerSchema);