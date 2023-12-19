const router = require('express').Router();
const {Issues,User,SourceMaterial} = require('../models');
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
    const issueData = await Issues.findAll({
        include: [{ model: SourceMaterial }, { model: User }],
        where: where,
    }).catch((err) => {
        res.json(err);
    });
    const issues = issueData.map((issue) => issue.get({ plain: true }));
    //console.log(issues);
    // get source material options
    const sourceMaterialsData = await SourceMaterial.findAll().catch((err) => res.json(err))
    const sourceMaterials = sourceMaterialsData.map(sourceMaterial => sourceMaterial.get({ plain: true }))

    // get the reading level options from the issues table
    // https://stackoverflow.com/questions/41519695/how-to-get-a-distinct-value-of-a-row-with-sequelize
    const readingLevels = await Issues.findAll({
        attributes: ['reading_level'],
        group: ['reading_level'],
    }).then(issues => issues.map(issue => issue.reading_level))
    readingLevels.sort();
    // TODO: sort reading levels and source materials
    //console.log(readingLevels);
    res.render('view_issues', {
        issues,
        readingLevels,
        sourceMaterials,
        source: req.query.source,
        level: req.query.level,
        loggedIn: req.session.loggedIn
    });
});



// view route url /issues/submit
router.get('/submit_issue', withAuth, async (req, res) => {
    try {
        res.render('submit_issue', {loggedIn: req.session.loggedIn})
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

// route to get one issue by id
router.get('/single_issue/:id', withAuth, async (req, res) => {
    try {
        const issueData = await Issues.findByPk(req.params.id);
        if (!issueData) {
            res.status(404).json({ message: 'No Issue with this ID found.' });
            return;
        }
        const issue = issueData.get({ plain: true });
        res.render('issue', { issue, loggedIn: req.session.loggedIn });
    } catch (err) {
        res.status(500).json(err);
    };
});

module.exports = router;
