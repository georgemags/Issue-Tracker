const router = require('express').Router();
const Issue = require('../models/Issue');

// route to get all issues
// ?? If I want this to render on a page other than the homepage, use '/view_issues' ??
router.get('/view_issues', async (req, res) => {
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
            res.status(404).json({ message: 'No Issue with this ID found.' });
            return;
        }
        const issue = issueData.get({ plain: true });
        res.render('issue', issue);
    } catch (err) {
        res.status(500).json(err);
    };
});

// route to create/add an issue
// SUBJECT TO CHANGE !!!!!!
router.post('/view_issues', async (req, res) => {
    try {
        const issueData = await Issue.create({
            source_mat: req.body.source_mat,
            passage: req.body.passage,
            reading_level: req.body.reading_level,
            description: req.body.description,
        });
        res.status(200).json(issueData);
    } catch (err) {
        res.status(400).json(err);
    }
});

// route to update the model ??
router.put('/:id', async (req, res) => {
    try {
        const issue = await Issue.update(
            {
                source_mat: req.body.source_mat,
                passage_title: req.body.passage,
                reading_level: req.body.reading_level,
                description: req.body.description,
            },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        res.status(200).json(issue);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
