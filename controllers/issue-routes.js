const router = require('express').Router();
const Issue = require('../models/Issue');

// route to get all issues
router.get('/', async (req, res) => {
    const issueData = await Issue.findAll().catch((err) => {
        res.json(err);
    });
    const issues = issueData.map((issue) => issue.get({ plain: true }));
    res.render('all', { issues });
});

// route to get one issue by id
router.get('/issue/:id', async (req, res) => {
    try {
        const issueData = await Issue.findByPk(req.params.id);
        if (!issueData) {
            res.status(404).json ({ message: 'No Issue with this ID found.'});
            return;
        }
        const issue = issueData.get({ plain: true });
        res.render('issue', issue);
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;
