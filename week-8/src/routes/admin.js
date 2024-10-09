//external dependencies
const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// imported modules
const { AdminModel, CourseModel } = require('../uitls/db');
const { adminAuthMiddleware } = require('../uitls/middleware');
const { courseTypeCheck, loginTypeCheck, signupTypeCheck } = require('../uitls/types');


const router = Router();

router.post('/signup', async (req, res) => {

    try {

        const typeChecked = signupTypeCheck.safeParse(req.body);
        if (!typeChecked.success) {
            throw new Error(typeChecked.error.issues);
        }
        const { email, password, firstName, lastName } = typeChecked.data;
        const hashedPassword = await bcrypt.hash(password, 5);


        await AdminModel.create({

            email,
            password: hashedPassword,
            firstName,
            lastName

        });
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

router.post('/login', async (req, res) => {

    try {
        const typeChecked = loginTypeCheck.safeParse(req.body);
        if (!typeChecked.success) {
            throw new Error(typeChecked.error.issues);
        }
        const { email, password } = typeChecked.data;
        const foundUser = await AdminModel.findOne({
            email
        });

        const isMatch = bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign({

            userId: foundUser._id,
            name: foundUser.firstName + ' ' + foundUser.lastName

        }, process.env.ADMIN_JWT_SECRET);
        res.status(200).json({ message: 'Admin authenticated successfully', token });

    } catch (error) {
        res.status(500).json({ message: 'Error finding the admin.', error });
    }


});

router.post('/course', adminAuthMiddleware, async (req, res) => {
    try {
        const typeChecked = courseTypeCheck.safeParse(req.body);
        if (!typeChecked.success) {
            throw new Error(JSON.stringify(typeChecked.error.issues));
        }

        const { title, description, price, imageUrl } = typeChecked.data;
        const newCourse = await CourseModel.create({
            title,
            description,
            price,
            imageUrl,
            instructor: req.userId
        });
        res.status(201).json({ message: 'Course created successfully', courseId: newCourse._id });
    } catch (error) {
        res.status(500).json({ message: 'Error creating course.', error });
    }
});

router.put('/course', adminAuthMiddleware, async (req, res) => {
    try {
        const { courseId } = req.query;
        const typeChecked = courseTypeCheck.safeParse(req.body);
        if (!typeChecked.success) {
            throw new Error(JSON.stringify(typeChecked.error.issues));
        }
        const { title, description, price, imageUrl } = typeChecked.data;
        const updatedCourse = await CourseModel.findOneAndUpdate({
            _id: courseId,
            instructor: req.userId,
        }, {
            title,
            description,
            price,
            imageUrl
        });
        if(updatedCourse) {
            return res.status(200).json({ message: 'Course updated successfully'});
        } else{
            throw new Error("Course update failed");
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating course.', error });
    }

});

router.get('/course/bulk', adminAuthMiddleware, async (req, res) => {
    try {
        const courses = await CourseModel.find({
            instructor: req.userId
        });
        console.log(courses);

        res.status(200).json({ courses });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses.', error });
    }
});



module.exports = {
    adminRouter: router
}