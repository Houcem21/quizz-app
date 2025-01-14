const express = require("express");
const {getQuestions, addQuestion, seedDatabase} = require("../controllers/questionController");
const router = express.Router();


router.get("/", getQuestions);
router.post("/", addQuestion);
router.post("/", seedDatabase);
module.exports = router;
