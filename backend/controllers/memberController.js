const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Member = require("../models/memberModel");

// @desc    Sign up member
// @route   POST api/member/
// @access  private
const signUpMember = asyncHandler(async (req, res) => {
    const {name, username, email, password, currentWeight, weightGoal, goal} = req.body;

    // check if any input is empty
    if(!name || !username || !email || !password || !currentWeight || !weightGoal || !goal) {
        res.status(400);
        throw new Error("Please enter all fields");
    }

    // check if member already exists
    const memberExists = await Member.findOne({email});
    if(memberExists) {
        res.status(400);
        throw new Error("Member already exists");
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create member's account
    const member = await Member.create({
        name,
        username,
        email,
        password: hashedPassword,
        goal: {
            currentWeight, weightGoal, goal
        }
    });

    // when the member's account is done created
    if(member) {
        res.status(201).json({
            _id: member.id,
            name: member.name,
            username: member.username,
            email: member.email,
            goal: {
                currentWeight: member.goal.currentWeight,
                weightGoal: member.goal.weightGoal,
                goal: member.goal.goal,
            },
            token: generateToken(member.id),
        })
    }
});

// @desc    Member login
// @route   POST api/member/login
// @access  private
const loginMember = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    
    // if any input id missing
    if(!email || !password) {
        res.status(400);
        throw new Error("Enter all fields");
    }

    // search for the member
    const member = await Member.findOne({email});

    // if the member exists and the password he entered is correct
    if(member && (await bcrypt.compare(password, member.password))) {
        res.json({
            _id: member.id,
            name: member.name,
            username: member.username,
            email: member.email,
            goal: {
                currentWeight: member.goal.currentWeight,
                weightGoal: member.goal.weightGoal,
                goal: member.goal.goal,
            },
            token: generateToken(member.id),
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});

// @desc    profile
// @route   GET api/member/me
// @access  private
const getMember = asyncHandler(async (req, res) => {
    // find the member info
    const {id, name, username, email, goal} = await Member.findById(req.member.id);
    
    // return the member info
    res.status(200).json({
        id, name, username, email,
        goal: {
            currentWeight: goal.currentWeight,
            weightGoal: goal.weightGoal,
            goal: goal.goal,
        },
    });
});

// @desc    Edit goal
// @route   PUT api/member/editGoal
// @access  private
const editGoal = asyncHandler(async (req, res) => {
    // find the member and update his goal
    const updateMemberGoal = await Member.findByIdAndUpdate(req.member.id, {
        $set: {
            goal: {
                currentWeight: req.body.currentWeight ?? req.member.goal.currentWeight,
                weightGoal: req.body.weightGoal ?? req.member.goal.weightGoal,
                goal: req.body.goal ?? req.member.goal.goal,
            }
        }
    });

    // the update was successful
    if(updateMemberGoal) {
        res.status(201).json({
            msg: `Goal for ${req.member.username} has been updated`,
        });
    }
});

// generate a token
const generateToken = (id) => {
    return jwt.sign({id, role: "member"}, process.env.JWT_SECRET, {expiresIn: '30d'});
};

module.exports = {
    signUpMember,
    loginMember,
    getMember,
    editGoal
}