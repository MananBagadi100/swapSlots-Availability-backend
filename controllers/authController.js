const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
    try {
        const {name,email,password} = req.body;
        // Check if user already exists
        const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (existing.length > 0) {
            return res.status(400).json({message: "Email already registered",isLoggedIn:false});
        }

        // Hashing the password 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserting the user
        const [result] = await db.query(
            "INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );
        const newUserId = result.insertId
        //generating the JWT token
        const token = jwt.sign(
            {id:newUserId,email: email},
            process.env.JWT_SECRET,{expiresIn:"7d"}
        );
        //storing the JWT token in the cookie
        res.cookie("token",token, {
            httpOnly:true,
            secure:false,
            sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({message: "User registered successfully "});
    } 
    catch (err) {
        return res.status(500).json({message: err.message});
    }
};

exports.login = async (req, res) => {
    try {
        const {email,password} = req.body;
        //checking if that user exists in the database
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }
        //we sign the payload with JWT to send it 
        const token = jwt.sign({id: user.id,email: user.email},
            process.env.JWT_SECRET, {expiresIn: "7d"}
        );
        //send the cookie which will contain the JWT token
        res.cookie("token",token,{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({message: "Login successful "});
    } 
    catch (err) {
        return res.status(500).json({
            message: err.message
        });
    }
};