const express = require('express');
const router = new express.Router();
const Products = require("./pdSchema");
const USER = require("./userSchema");
const bcrypt = require("bcryptjs");
const authenticate = require("./authenticate");

// get products data api
router.get("/", async (req, res) => {
    try {
        const productsdata = await Products.find();
        //console.log(productsdata);
        res.status(201).json(productsdata);
    } catch (error) {
        console.log(error.message);
    }

});

// get individual data
router.get("/getpone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        //console.log(id);
        const indata = await Products.findOne({ id });
        //console.log(indata);
        res.status(201).json(indata);

    } catch (error) {
        res.status(400).json(indata);
        console.log(error.message);
    }
});


// register data
router.post("/register", async (req, res) => {
    //console.log(req.body);

    const { fname, email, mobile, password, cpassword } = req.body;

    if (!fname || !email || !mobile || !password || !cpassword) {
        res.status(400).json({ error: "data insufficient" });
        console.log("no data available");
    }
    try {
        const preuser = await USER.findOne({ email: email });
        if (preuser) {
            res.status(421).json({ error: "this user is already present" });
        }
        else if (password !== cpassword) {
            res.status(422).json({ error: "please fill the password carefully" });
        }
        else {
            const newuser = new USER({
                fname, email, mobile, password, cpassword
            });
            const storedata = await newuser.save();
            //console.log(storedata);
            res.status(201).json(storedata);
        }
    } catch (error) {

    }

})

// user login
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "data insufficient" });
        console.log("no data available");
    }
    try {
        const preuser = await USER.findOne({ email: email });

        if (preuser) {
            const isMatch = await bcrypt.compare(password, preuser.password);
            console.log(isMatch);
            if (isMatch) {
                // token generate
                const token = await preuser.generateAuthtoken();
                //console.log(token);

                res.cookie("Amazonweb", token, {
                    expires: new Date(Date.now() + 21600000),
                    httpOnly: true
                })
                res.status(201).json(preuser);
            }
            else {
                res.status(422).json({ error: "ivalid credentials" });
                console.log("galat password");

            }
        }
        else {
            res.status(421).json({ error: "ivalid credentials" });
            console.log("user not found");
        }

    } catch (error) {
        res.status(422).json({ error: "ivalid credentials" });
    }

})

//  adding the data to the cart
router.post("/addcart/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Products.findOne({ id: id });
        const Usercontact = await USER.findOne({ _id: req.userID });

        if (Usercontact) {
            const isProductInCart = Usercontact.carts.some(item => item.id === cart.id);

            if (!isProductInCart) {
                Usercontact.carts.push(cart);
                await Usercontact.save();
                res.status(201).json(Usercontact);
            } else {
                res.status(200).json({ message: "Product already in cart" });
            }
        }
    } catch (error) {
        console.log(error);
    }
});


router.get("/checkout", authenticate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID });
        res.status(201).json(buyuser);

    } catch (error) {
        console.log(error + "error for buy now");
    }
});

router.get("/remove/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((curel) => {
            return curel.id != id
        });

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item removed");

    } catch (error) {
        console.log(error + "jwt provide then remove");
        res.status(400).json(error);
    }
});

router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((cur_elem) => {
            return cur_elem.token !== req.token
        });

        res.clearCookie("Amazonweb", { path: "/" });
        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        //console.log("user logout");

    } catch (error) {
        console.log(error + "jwt provide then logout");
    }
});




module.exports = router;