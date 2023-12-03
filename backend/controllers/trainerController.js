const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Trainer = require("../models/trainerModel");

// @desc    Sign up trainer
// @route   POST api/trainer/
// @access  private
const signUpTrainer = asyncHandler(async (req, res) => {
    const {name, username, email, password, about} = req.body;

    // check if any input is empty
    if(!name || !username || !email || !password || !about) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    // check if trainer already exists
    const trainerExists = await Trainer.findOne({email});
    if(trainerExists) {
        res.status(400);
        throw new Error("Trainer already exists");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create member's account
    const trainer = await Trainer.create({
        name,
        username,
        email,
        password: hashedPassword,
        about
    });

    // when the member's account is done created
    if(trainer) {
        res.status(201).json({
            _id: trainer.id,
            name: trainer.name,
            username: trainer.username,
            email: trainer.email,
            about: trainer.about,
            token: generateToken(trainer.id),
        })
    }
});

// @desc    Login trainer
// @route   POST api/trainer/login
// @access  private
const loginTrainer = asyncHandler( async(req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password) {
        res.status(400);
        throw new Error("Enter all fields");
    }

    // if trainer exists
    const trainer = await Trainer.findOne({email});

    // if the trainer exists and the password he entered is correct
    if(trainer && (await bcrypt.compare(password, trainer.password))) {
        res.json({
            _id: trainer.id,
            name: trainer.name,
            username: trainer.username,
            email: trainer.email,
            about: trainer.about,
            token: generateToken(trainer.id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    Trainer profile
// @route   GET api/trainer/me
// @access  private
const getTrainer = asyncHandler(async (req, res) => {
    const {id, name, username, email, about} = await Trainer.findById(req.trainer.id);

    res.status(200).json({
        id, name, username, email, about
    });
});

// generate a token
const generateToken = (id) => {
    return jwt.sign({id, role: "trainer"}, process.env.JWT_SECRET, {expiresIn: '30d'});
};

module.exports = {
    signUpTrainer,
    loginTrainer,
    getTrainer
}