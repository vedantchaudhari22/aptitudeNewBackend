import express from 'express';
import { getQuestions, addQuestion, getQuestionById, updateQuestion, deleteQuestion } from '../controllers/questionController.js';
import upload from '../middleware/upload.js'; // Import the middleware

const router = express.Router();

router.get('/', getQuestions);
router.get('/:id', getQuestionById);
// router.post('/add', upload.single('image'), addQuestion);
router.post('/add', upload.single('graphImage'), addQuestion);
router.put('/:id', upload.single('graphImage'), updateQuestion);
router.delete('/:id', deleteQuestion);

export default router;