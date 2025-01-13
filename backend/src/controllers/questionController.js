const Question = require("../models/Question");

    //Get All questions
    const getQuestions = async (req, res) => {
        try {
            const questions = await Question.find();
            res.status(200).json(questions);  
        } catch (error) {
            res.status(500).json({error: error.message})
        }
    };

    //Add a new question
    const addQuestion = async (req, res) => {
        try {
            const newQuestion = new Question(req.body);
            await newQuestion.save();
            res.status(201).json(newQuestion);
        } catch (error) {
            res.status(400).json({error: error.message});
        }
    }

module.exports = {getQuestions, addQuestion};
