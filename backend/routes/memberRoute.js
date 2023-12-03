const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { signUpMember, loginMember, getMember, editGoal } = require("../controllers/memberController");

router.post("/", signUpMember);
router.post("/login", loginMember);
router.get("/me", protect, getMember);
router.put("/editGoal", protect, editGoal);

module.exports = router;