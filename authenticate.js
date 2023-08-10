const USER = require("./userSchema");
const jwt = require("jsonwebtoken");
const secrets = process.env.KEY;

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.Amazonweb; // Retrieve the token from the cookies

        if (!token) {
            console.log("mila hi nhi kuch");
        }

        const verifyToken = jwt.verify(token, secrets);

        const rootUser = await USER.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) {
            throw new Error("User Not Found");
        }

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();
    } catch (error) {
        res.status(401).send("Unauthorized: Invalid token");
        console.log(error);
    }
};

module.exports = authenticate;