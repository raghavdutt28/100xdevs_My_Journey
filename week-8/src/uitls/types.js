const { z } = require('zod');

const loginTypeCheck = z.object({
    email: z.string().email().min(5).max(100),
    password: z.string().min(8).max(100).regex(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Invalid password format"),
});

const signupTypeCheck = loginTypeCheck.extend({
    firstName: z.string().max(100),
    lastName: z.string().max(100)
});

const courseTypeCheck= z.object({
    title: z.string().min(5).max(100),
    description: z.string().max(500),
    price: z.number().min(0).max(1000),
    imageUrl: z.string().max(500)
});


module.exports = {
    loginTypeCheck,
    signupTypeCheck,
    courseTypeCheck
}