const express = require('express');
const cors = require('cors');
const { userRouter } = require('./routes/user');
const { courseRouter } = require('./routes/course');
const { adminRouter } = require('./routes/admin');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use('/v1/user', userRouter);
app.use('/v1/course', courseRouter);
app.use('/v1/admin', adminRouter);

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
}

main();