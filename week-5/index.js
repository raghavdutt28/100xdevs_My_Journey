const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/sum/:a/:b', (req, res) => {
    const {a, b} = req.params;
    const sum = parseInt(a) + parseInt(b);
    res.json({
        Answer: sum
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});