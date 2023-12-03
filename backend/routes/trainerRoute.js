const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { signUpTrainer, loginTrainer, getTrainer } = require("../controllers/trainerController");

router.post("/", signUpTrainer);
router.post("/login", loginTrainer);
router.get("/me",  protect, getTrainer);

module.exports = router;