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
        const questionData = req.body;

        // 1. Handle the Image URL from Cloudinary
        if (req.file) {
            questionData.imageUrl = req.file.path; // Cloudinary returns the full https URL here
        }

        // 2. Handle Options (Safe Parsing)
        // If frontend sends as array via formData, Multer might already have it as an array
        if (typeof questionData.options === 'string') {
            try {
                // Only parse if it looks like a JSON string
                if (questionData.options.startsWith('[')) {
                    questionData.options = JSON.parse(questionData.options);
                } else {
                    // If it's a single string, wrap it in an array
                    questionData.options = [questionData.options];
                }
            } catch (e) {
                console.error("JSON Parsing failed, using raw value");
            }
        }

        const newQuestion = new Question(questionData);
        await newQuestion.save();

        res.status(201).json({
            message: "Question added successfully",
            newQuestion
        });
    } catch (error) {
        console.error("DETAILED ERROR:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message // This will now show the actual error in the response
        });
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