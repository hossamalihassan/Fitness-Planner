const express = require("express");
const router = express.Router();
const { createPlan, ratePlan, getPlan } = require("../controllers/planController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createPlan); // only trainer can access
router.put("/rate/:id&:rating", protect, ratePlan); // only member can access
router.get("/:id", getPlan);

module.exports = router;