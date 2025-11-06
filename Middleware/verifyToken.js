const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.cookies.token; // read token from cookie

    if (!token) {
        return res.status(401).json({
            message: "Access Denied. No Token Provided.",
            isLoggedIn : false
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //pass user details to the next function
        req.user = decoded;
        next();
    } 
    catch (err) {
        return res.status(401).json({
            message: "Invalid or Expired Token",
            isLoggedIn : false
        });
    }
};