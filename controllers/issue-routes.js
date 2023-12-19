const router = require('express').Router();
const Issue = require('../models/Issues.js');
const SourceMat = require('../models/SourceMat.js');
const User = require('../models/User.js');
const withAuth = require('../utils/auth');

// route to get all issues - or a filtered set of issues if parameters are sent in from the form
router.get('/', withAuth, async (req, res) => {
    //If the form is sending in non-default parameters - create an object to specify where in our Sequelize query
    let where = {}
    if (req.query.source && req.query.source != 'Source') {
        where.source_mat_id = req.query.source
    }
    if (req.query.level && req.query.level != 'Reading Level') {
        where.reading_level = req.query.level
    }

    // get all issues, filtered by our query params
    const issueData = await Issue.findAll({
        include: [{model: SourceMat}, {model: User}],
        where: where
    }).catch((err) => {
        res.json(err);
    });
    const issues = issueData.map((issue) => issue.get({ plain: true }));

    // get source material options
    const sourceMaterialsData = await SourceMat.findAll().catch((err) => res.json(err))
    const sourceMaterials = sourceMaterialsData.map(sourceMaterial => sourceMaterial.get({plain: true}))

    // get the reading level options from the issues table
    // https://stackoverflow.com/questions/41519695/how-to-get-a-distinct-value-of-a-row-with-sequelize
    const readingLevels = await Issue.findAll({
        attributes: ['reading_level'],
        group: ['reading_level']
    }).then(issues => issues.map(issue => issue.reading_level))

    // TODO: sort reading levels and source materials
    // TODO: reformat date

    res.render('view_issues', {
        issues,
        readingLevels,
        sourceMaterials,
        source: req.query.source,
        level: req.query.level
    });
});

// route to get one issue by id
router.get('/:id', async (req, res) => {
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
router.post('/', async (req, res) => {
    try {
        const issueData = await Issue.create({
            user_id: req.session.user_id,
            source_mat_id: req.body.source_mat_id,
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

module.exports = router;
