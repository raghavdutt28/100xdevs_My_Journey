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
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});

const Admin = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    }
});

const Course = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    imageUrl:{
        type: String,
        required: true
    },
    instructor: {
        type: ObjectId,
        ref: 'Admin',
        required: true
    }
});

const Purchase = new Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    courseId: {
        type: ObjectId,
        ref: 'Course',
        required: true
    }
});

Purchase.index({ userId: 1, courseId: 1 }, { unique: true });



const UserModel = mongoose.model('users', User);
const AdminModel = mongoose.model('admins', Admin);
const CourseModel = mongoose.model('courses', Course);
const PurchaseModel = mongoose.model('purchases', Purchase);


module.exports = {
    UserModel,
    AdminModel,
    CourseModel,
    PurchaseModel
}