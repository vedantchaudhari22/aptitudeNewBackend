import { Learn } from '../models/learnModel.js'; // Assuming you named it Learn

// @desc    Add a new video lecture
// @route   POST /api/learn
export const addLecture = async (req, res) => {
    try {
        const { topic, category, videoUrl, description, duration } = req.body;
        const lecture = await Learn.create({
            topic,
            category,
            videoUrl,
            description,
            duration
        });
        res.status(201).json(lecture);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all video lectures for the Learn Page table
// @route   GET /api/learn
export const getLectures = async (req, res) => {
    try {
        const lectures = await Learn.find({});
        res.status(200).json(lectures);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a lecture (e.g., changing the video link)
// @route   PUT /api/learn/:id
export const updateLecture = async (req, res) => {
    try {
        const updatedLecture = await Learn.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.status(200).json(updatedLecture);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a lecture
// @route   DELETE /api/learn/:id
export const deleteLecture = async (req, res) => {
    try {
        await Learn.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Lecture deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};