import { Question } from '../models/Question.js';

// Get all questions or filter by category
export const getQuestions = async (req, res) => {
    try {
        const { topic, company } = req.query;

        // If topic exists, filter by it. If not, pass an empty object {} to find ALL.
        // const filter = topic ? { topic: topic } : {};

        const filter = {};
        if (topic) filter.topic = topic;
        if (company) filter.company = company;

        const questions = await Question.find(filter).sort({ createdAt: -1 }); // Sort by newest first

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching questions",
            error: error.message
        });
    }
};

// Get a single question by its ID
export const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await Question.findById(id);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        // CastError happens if the ID string isn't a valid MongoDB ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid ID format" });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Add a new question
export const addQuestion = async (req, res) => {
    try {
        const questionData = { ...req.body };

        if (req.file) {
            questionData.imageUrl = req.file.path;
        }

        // Only parse if it's a string that LOOKS like an array
        if (typeof req.body.options === 'string' && req.body.options.startsWith('[')) {
            questionData.options = JSON.parse(req.body.options);
        } else if (typeof req.body.options === 'string') {
            questionData.options = [req.body.options];
        }

        const newQuestion = new Question(questionData);
        await newQuestion.save();

        res.status(201).json({ message: "Success", newQuestion });
    } catch (error) {
        console.error("Vercel Crash Log:", error);
        res.status(500).json({ error: error.message });
    }
};

// Update a question
export const updateQuestion = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        if (typeof updateData.options === 'string') {
            updateData.options = JSON.parse(updateData.options);
        }

        const updated = await Question.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: "Question updated", updated });
    } catch (error) {
        res.status(400).json({ message: "Update failed", error: error.message });
    }
};

// Delete a question
export const deleteQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed", error: error.message });
    }
};