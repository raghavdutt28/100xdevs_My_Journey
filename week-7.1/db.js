const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    }
});

const Todo = new Schema({
    title: {
        type: String,
        required: true
    },
    done: {
        type: Boolean,
        default: false
    },
    userId: {
        type: ObjectId,
        ref: "User",
        required: true
    }
});

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);


module.exports = {
    UserModel,
    TodoModel
}