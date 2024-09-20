const express = require('express');
const jwt = require('jsonwebtoken');

const JWTSECRET = "ILOVEMOMO";

// function generateToken (){
//     let options = [
//         '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
//         'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
//         'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
//       ];

//     let token = '';
//     for (let i = 0; i<32; i++) {
//         token += options[Math.floor(Math.random() * options.length)];
//     }
//     return token;
// };

const app = express();

app.use(express.json());

let users = [];

app.post('/signup', (req, res) => {
    const { username, password } = req.body;


    users.push({ username, password });
    console.log(users);

    res.status(201).json({ message: 'User created successfully' });
});

app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    const loggingUser = users.find((user) => {
        if(user.username === username && user.password === password){
            return user;
        }
    });
    if (loggingUser) {
        const authToken = jwt.sign({
            username: loggingUser.username,
        }, JWTSECRET);
        loggingUser.token = authToken;
        console.log(users);
        res.status(200).json({ message: 'User logged in successfully', token: authToken });
    }
    else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

app.get('/me', (req, res) => {
    const token = req.headers.authorization;

    const foundUsername = jwt.verify( token, JWTSECRET );
    const foundUser = users.find((user) => {
        if(user.username === foundUsername.username){
            return user;
        }
    });
    if (foundUser) {
        res.status(200).json({ Username: foundUser.username, Password: foundUser.password});
    }
    else {
        res.status(401).json({ message: 'Invalid Authorization' });
    }
});

app.listen(3000,() => {
    console.log('Server is running on port 3000');
})