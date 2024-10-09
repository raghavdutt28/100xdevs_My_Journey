const { Router } = require('express');
const { CourseModel, PurchaseModel } = require('../uitls/db');
const { userAuthMiddleware } = require('../uitls/middleware');

const router = Router();

router.post('/purchase', userAuthMiddleware, async (req, res) => {
    try {
        const { courseId } = req.query;
        await PurchaseModel.create({
            userId: req.userId,
            courseId: courseId,
        });
        res.status(200).send({ message: 'Course purchased' });
    } catch (error) {
        res.status(500).json({ message: 'Error purchasing course', error });
    }
});

router.get('/preview', userAuthMiddleware, async (req, res) => {
    try {
       const courses = await CourseModel.find({});
        res.status(200).send({ courses }); 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error });
    }
});

module.exports = {
    courseRouter: router
}