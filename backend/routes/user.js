const express = require('express')
const zod = require('zod')
const router = express.Router()
const {User} = require ('../db')
const jwt = require("jsonwebtoken")
const JWT_SECRET = require('../config')

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
    firstName: zod.string(),
    password: zod.string(),
})

router.post("/signup", async (req, res) => {
    const body = req.body
    const {success} = signupSchema.safeParse(req.body)
    if (!success) {
        return res.json({
            message: "Email already taken / Incorrect Output"
        })
    }

    const user = User.findOne({
        username: body.username
    })

    if(user._id){
        return res.json({
            message:"User already exists"
        })
    }

    const dbUser = await User.create(body)
    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET)
    res.json({
        message: "User Created Successfully",
        token: token,
    })

})

modile.exports = router