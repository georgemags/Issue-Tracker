const router = require('express').Router();
const { User } = require('../models');
const withAuth = require('../utils/auth');

// keeps users not logged in from viewing the homepage
router.get('/', withAuth, async (req, res) => {
    try {
        const userData = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['name', 'ASC']],
        });
        const users = userData.map((project) => project.get({ plain: true }));
        res.render('login', {
            users,
            loggedIn: req.session.loggedIn,
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// if there is an existing session this route will redirect
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});
// if there is an existing session this route will redirect
router.get('/submit_issue', (req, res) => {

    res.render('submit_issue');
});
module.exports = router;
