const router = require("express").Router();
const {Issues} = require('../../models');
const withAuth = require('../../utils/auth');

// routes to /api/issues/create
router.post('/create',withAuth, async (req, res) => {
    try {
        console.log(' creating issue with body:', req.body)
        const issueData = await Issues.create({
            user_id: req.session.user_id,
            source_mat_id: req.body.source_mat_id,
            passage: req.body.passage,
            reading_level: req.body.reading_level,
            description: req.body.description,
        });
        res.status(200).json(issueData);
    } catch (err) {
        console.log(err)
        res.status(400).json(err);
    }
});

// routes to /api/issues/update/:id
router.put('/update/:id',withAuth, async (req, res) => {
    try {
        const issue = await Issues.update(
            {
                user_id: req.session.user_id,
                source_mat_id: req.body.source_mat_id,
                passage: req.body.passage,
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

module.exports = router