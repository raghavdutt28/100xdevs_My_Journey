const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const JWTSECRET = "ILOVEMOMO";

let users = [];


function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized, please login again.' });
    }
    else {
        const decoded = jwt.verify(token, JWTSECRET);
        if (decoded) {
            req.user = users.find((user) => {
                if(decoded.username === user.username){
                    return user;
                }
            });
            next();
        }
        else {
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}

const app = express();

app.use(express.json());
app.use(cors());

app.post('/signup', function (req, res) {
    const { username, password } = req.body;

    users.push({ username, password, todos: [] });
    res.status(201).json({ message: 'User created successfully' });
});


app.post('/signin', function (req, res) {
    const { username, password } = req.body;

    const foundUser = users.find((user) => {
        if (user.username === username && user.password === password) {
            return user;
        }
    });

    if (foundUser) {
        const token = jwt.sign({
            username: foundUser.username
        }, JWTSECRET);
        foundUser.token = token;
        res.status(200).json({ message: 'User authenticated successfully', token });
    }
    else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});


// app.get('/me', authMiddleware, function (req, res) {

//     if (req.user) {
//         res.status(200).json({
//             username: req.user.username,
//             password: req.user.password
//         });
//     } else {
//         res.status(401).json({ message: 'Invalid Authorization to get your info, please login again.' });
//     }
// });

app.post('/todos', authMiddleware, function (req, res) {
    const { title } = req.body;
    console.log(title);
    const id = req.user.todos.length + 1;

    if (req.user){
        req.user.todos.push({
            id: id,
            title: title,
            done: false
        });
        console.log("added new todo");
        res.status(201).json({ message: 'Todo created successfully' });
        console.log("response sent");
    } else {
        res.status(401).json({ message: 'Invalid Authorization to create todo, please login again.' });
    }
});


app.get('/todos', authMiddleware, function (req, res) {

    
    if (req.user) {
        res.status(200).json({
            todos: req.user.todos
        });
    } else {
        res.status(401).json({ message: 'Invalid Authorization to get todos, please login again.' });
    }
});


app.put('/todos/:id', authMiddleware, function (req, res) {
    const { done } = req.body;
    const { id } = req.params;

    if (req.user) {
        const foundTodo = req.user.todos.find((todo) => {
            if (todo.id === parseInt(id)) {
                return todo;
            }
        });
        if (foundTodo) {
            foundTodo.done = done;
            res.status(200).json({ message: 'Todo updated successfully' });
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } else {
        res.status(401).json({ message: 'Invalid Authorization to update todo, please login again.' });
    }
});


app.delete('/todos/:id', authMiddleware, function (req, res) {
    const { id } = req.params;

    if(req.user) {
        const foundTodoIndex = req.user.todos.findIndex((todo) => todo.id === parseInt(id));
        if (foundTodoIndex !== -1) {
            req.user.todos.splice(foundTodoIndex, 1);
            res.status(200).json({ message: 'Todo deleted successfully' });
        } else {
            res.status(404).json({ message: 'Todo not found' });
        }
    } else {
        res.status(401).json({ message: 'Invalid Authorization to delete todo, please login again.' });
    }
});


app.listen(3000, () => console.log('Server is running on port 3000'));