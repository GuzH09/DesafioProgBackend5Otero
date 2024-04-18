import {Router} from 'express';
import userModel from '../dao/models/usersModel.js';

const usersRouter = Router();

// API Register
usersRouter.post("/register", async (req, res) => {
    try {
        req.session.failRegister = false;
        await userModel.create(req.body);
        res.redirect("/login");
    } catch (e) {
        console.log(e.message);
        req.session.failRegister = true;
        res.redirect("/register");
    }
});

// API Login
usersRouter.post("/login", async (req, res) => {
    try {
        req.session.failLogin = false;

        if (req.body.email == 'adminCoder@coder.com' && req.body.password == 'adminCod3r123') {
            const result = {
                'role': 'Admin',
                'first_name': 'Coder',
                'last_name': 'House',
            }
            req.session.user = result;
        } else {
            const result = await userModel.findOne({email: req.body.email}).lean();
            if (!result) {
                req.session.failLogin = true;
                return res.redirect("/login");
            }

            if (req.body.password !== result.password) {
                req.session.failLogin = true;
                return res.redirect("/login");
            }
            delete result.password;
            result.role = 'Usuario';
            req.session.user = result;
        }

        return res.redirect("/allproducts");
    } catch (e) {
        req.session.failLogin = true;
        return res.redirect("/login");
    }
});

// API Logout
usersRouter.post("/logout", (req, res) => {
    req.session.destroy(error => {
        if (!error) return res.redirect("/login");
        res.send({
            status: "Logout ERROR",
            body: error
        });
    })
});

export default usersRouter;