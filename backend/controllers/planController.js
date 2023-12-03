const asyncHandler = require("express-async-handler");
const Plan = require("../models/planModel");
const Trainer = require("../models/trainerModel");

// @desc    Create a plan
// @route   POST api/plan/create
// @access  private
const createPlan = asyncHandler(async (req, res) => {
    const { id } = await Trainer.findById(req.trainer.id);
    const { title, about, price, index, content } = req.body;

    if(!title || !about || !price || !index || !content) {
        res.status(400);
        throw new Error("Enter all fields");
    }

    // create the plan
    const plan = await Plan.create({
        trainer: id, title, about, price, index, content
    });

    if(plan) {
        res.status(201).json(plan);
    }
});

// @desc    Rate a plan
// @route   PUT api/plan/rate/:id
// @access  private
const ratePlan = asyncHandler(async (req, res) => {
    const planId = req.params.id;
    const { id } = await Trainer.findById(req.trainer.id);
    const newRating = req.params.rating;
    
    // get the pervious ratings of the plan, then we append the new rating to it
    const { rating } = await Plan.findById(planId);
    rating.push({user: id, rating: newRating});

    // update the ratings
    const addRating = await Plan.findByIdAndUpdate(planId, {
        $set: {
            rating: rating,
        }
    });

    if(addRating) {
        res.status(201).json({
            ratings: rating
        });
    }
});

// @desc    Plan page
// @route   GET api/plan/:id
// @access  private
const getPlan = asyncHandler(async (req, res) => {
    const planId = req.params.id;

    // find the plan
    const plan = await Plan.findById(planId);

    // the plan exists
    if(plan) {
        res.status(200).json(plan);
    }
});

module.exports = {
    createPlan,
    ratePlan,
    getPlan
}