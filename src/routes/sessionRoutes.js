import {Router} from "express";
import passport from 'passport';

import config from "../config.js";
import { isValidPassword, verifyRequiredBody } from '../services/utils.js';
import initAuthStrategies from '../auth/passport.strategies.js';

const router = Router()
initAuthStrategies();

router.post("/login", verifyRequiredBody(["email", "password"]), passport.authenticate("login", { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}`}), async (req, res) => {
    try {
        req.session.user = req.user;
        req.session.save(err => {
            if (err) {
                return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
            }
            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
})



router.get('/ghlogin', passport.authenticate('ghlogin', {scope: ['user']}), async (req, res) => {
});

router.get('/ghlogincallback', passport.authenticate('ghlogin', {failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}`}), async (req, res) => {
    try {
        req.session.user = req.user 
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        
            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});


// router.get("/private" , async (req, res) => {
//     try {
        
//     } catch (error) {
        
//     }
// })

router.get("/logout" , async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
            res.redirect('/login')
        })
    } catch (error) {
        
    }
})

router.get("/current", async (req, res) => {
    if(!req.session.user){
        return res.redirect("/login")
    }
    res.status(200).send({ origin: config.SERVER, payload: req.session.user })
})

export default router