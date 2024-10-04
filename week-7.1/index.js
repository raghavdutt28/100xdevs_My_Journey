const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { authMiddleware } = require('./auth.js');
const {UserModel, TodoModel} = require('./db.js');
const { signupTypeCheck, loginTypeCheck, todoCreateTypeCheck, todoUpdateTypeCheck } = require('./types.js');

//remove before pushing to github
mongoose.connect("");

const JWTSECRET = "ILOVEMOMO";


const app = express();
app.use(cors());
app.use(express.json());


app.post('/signup', async function (req, res) {

    const parsedData = signupTypeCheck.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: 'Email or Password is not in the required format.', error: parsedData.error});
    }
    const {email, password, name} = parsedData.data;

    const hashedPassword = await bcrypt.hash(password, 5);
    try {
        await UserModel.create({ email, password: hashedPassword, name });
        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message});
    }
});


app.post('/login', async function (req, res) {

    const parsedData = loginTypeCheck.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: 'Email or Password is not in the required format.', error: parsedData.error});
    }
    const {email, password} = parsedData.data;
    try {
        const foundUser = await UserModel.findOne({
            email: email
        });
        try {
            const isMatch = await bcrypt.compare(password, foundUser.password);
            if (!isMatch) {
                throw new Error("Invalid password");
            }
            const token = jwt.sign({
                userId: foundUser._id,
                name: foundUser.name,
            }, JWTSECRET);
            res.status(200).json({ message: 'User authenticated successfully', token});
        } catch (error) {
            res.status(401).json({ message: 'Invalid credentials', error: error.message });
        }

    } catch (error) {
        res.status(404).json({ message: 'User not found', error: error.message});
    }
});


app.post('/todos', authMiddleware, async function (req, res) {

    const parsedData = todoCreateTypeCheck.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: 'Email or Password is not in the required format.', error: parsedData.error});
    }
    const {title} = parsedData.data;

    try {
        await TodoModel.create({
            title: title,
            done: false,
            userId: req.userId,
        });
        res.status(201).json({ message: 'Todo created successfully' });
    } catch(error) {
        res.status(500).json({ message: 'Error creating todo.',  error: error.message });
    }
});


app.get('/todos', authMiddleware, async function (req, res) {

    const todos = await TodoModel.find({
        userId: req.userId,
    });

    try {
        res.status(200).json({
            todos: todos,
            name: req.name
        });
    } catch(error) {
        res.status(500).json({ message: 'Error getting todos.', error: error.message, name: req.name });
    }
});


app.put('/todos/:id', authMiddleware, async function (req, res) {

    const parsedData = todoUpdateTypeCheck.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ message: 'Email or Password is not in the required format.', error: parsedData.error});
    }
    const {done} = parsedData.data;
    const todoId = req.params.id;
    try {
        await TodoModel.updateOne({
            _id: todoId,
            userId: req.userId
        },{
            done: done
        });
        res.status(200).json({ message: 'Todo updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating', error: error.message });
    }
});


app.delete('/todos/:id', authMiddleware, async function (req, res) {
    const todoId = req.params.id;

    try {
        await TodoModel.deleteOne({
            _id: todoId,
            userId: req.userId
        });
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting', error: error.message });
    }
});


app.listen(3000, () => console.log('Server is running on port 3000'));