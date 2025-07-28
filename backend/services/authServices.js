const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const signUp = async (req) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    const alreadyExistUser = await userModel.findOne({ email });
    if (alreadyExistUser) {
        throw new Error("User with this Email already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10); //salt value is 10 ,Ensures Unique Hashes

    const newUser = await userModel.create({  // this step automatically saves
        name,
        email,
        password: hashedPassword,        
        role
    });

    const token = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '10h' }
    );

    return { user: newUser, token };
}

const login = async (req) => {
    const email = req.body.email;                  
    const password = req.body.password;

    const alreadyExistUser = await userModel.findOne({ email }); 
    if (!alreadyExistUser) {
        throw new Error("no such user");
    }

    const passwordMatching = await bcrypt.compare(password, alreadyExistUser.password); 
    if (!passwordMatching) {
        throw new Error("wrong credentials");
    }

    const token = jwt.sign(
        { userId: alreadyExistUser._id, role: alreadyExistUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '10h' }
    );

    return { user: alreadyExistUser, token }; 
}

module.exports = {
    signUp,
    login
}
