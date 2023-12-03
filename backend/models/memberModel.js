const mongoose = require("mongoose");

const goalSchema = mongoose.Schema({
    currentWeight: {
        type: String,
        required: [true, "please add your current weight"]
    },
    weightGoal: {
        type: String,
        required: [true, "please add your weight goal"]
    },
    goal: {
        type: String,
        required: [true, "please add your goal"]
    },
}, {
    _id: false
});

const memberSchema = mongoose.Schema({
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
    profilePicture: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "please add a password"]
    },
    goal: goalSchema
}, {
    timestamps: true
});

module.exports = mongoose.models.Member || mongoose.model("Member", memberSchema);