const { z } = require('zod');

const loginTypeCheck = z.object({
    email: z.string().email().min(5).max(100),
    password: z.string().min(8).max(100).regex(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/),
});

const signupTypeCheck = loginTypeCheck.extend({
    name: z.string().max(100)
});

const todoCreateTypeCheck = z.object({
    title: z.string().max(100),
});

const todoUpdateTypeCheck = z.object({
    done: z.boolean()
});


module.exports = {
    signupTypeCheck,
    loginTypeCheck,
    todoCreateTypeCheck,
    todoUpdateTypeCheck,
 };