const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.userId) {
        return res.render('index', { account: 'is'})
    }
    res.render('index');
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})


router.get('/profile', (req, res) => {
    if (req.session.userId) {
        return res.render('profile', { account: 'is', name: req.session.name })
    }
    return res.render('index');
})


module.exports = router;