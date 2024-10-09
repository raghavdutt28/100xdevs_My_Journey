//external dependencies
const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// imported modules
const { PurchaseModel, UserModel, CourseModel } = require('../uitls/db');
const { signupTypeCheck, loginTypeCheck } = require('../uitls/types');
const { userAuthMiddleware } = require('../uitls/middleware');

const router = Router();

router.post('/signup', async (req, res) => {
    try {
        const typeChecked = signupTypeCheck.safeParse(req.body);
        if (!typeChecked.success) {
            throw new Error(JSON.stringify(typeChecked.error.issues));
        }
        const { email, password, firstName, lastName } = typeChecked.data;
        const hashedPassword = await bcrypt.hash(password, 5);


        await UserModel.create({

            email,
            password: hashedPassword,
            firstName,
            lastName

        });
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }

});

router.post('/login', async (req, res) => {

    try {
        const typeChecked = loginTypeCheck.safeParse(req.body);
        if (!typeChecked.success) {
            throw new Error(JSON.stringify(typeChecked.error.issues));
        }
        const { email, password } = typeChecked.data;
        const foundUser = await UserModel.findOne({
            email
        });

        const isMatch = bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign({

            userId: foundUser._id,
            name: foundUser.firstName + foundUser.lastName

        }, process.env.USER_JWT_SECRET);
        res.json({ message: 'User authenticated successfully', token });

    } catch (error) {
        return res.status(500).json({ message: 'Error finding the user.', error });
    }


});

router.get('/purchases', userAuthMiddleware, async (req, res) => {
    try {
        const purchases = await PurchaseModel.find({
            userId: req.userId
        });
        const boughtCourses = await CourseModel.find({
            _id: purchases.map(purchase => purchase.courseId)
        });
        res.status(200).json({ boughtCourses });
    } catch (error) {
        res.status(500).json({ message: 'Error getting purchases.', error });
    }
});


module.exports = {
    userRouter: router
}