const router = require('express').Router();
const { Issues,User,SourceMaterial } = require('../models');
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
    res.render('view_issues', {
        issues,
        sourceMaterials: await getSourceMaterials(),
        readingLevels: await getReadingLevels(),
        source: req.query.source,
        level: req.query.level,
        loggedIn: req.session.loggedIn
    });
});

// view route url /issues/submit
router.get('/submit_issue', withAuth, async (req, res) => {
    try {
        res.render('submit_issue', {
            sourceMaterials: await getSourceMaterials(),
            readingLevels: await getReadingLevels(),
            user: await getUserById(req.session.user_id),
            loggedIn: req.session.loggedIn
        })
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

router.get('/submitted', withAuth, async (req, res) => {
    res.render('issues_submitted', {
        loggedIn: req.session.loggedIn
    })
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

//function to get user data by id to use in the views
async function getUserById(userId) {
    const user = await User.findOne({
        where: {
            user_id: userId
        },
    });
    return user.get({ plain: true })
}

//function to pass sourceMaterials from the sourceMaterials table to the views
async function getSourceMaterials() {
    const sourceMaterialsData = await SourceMaterial.findAll().catch((err) => res.json(err))
    return sourceMaterialsData.map(sourceMaterial => sourceMaterial.get({ plain: true }))
}

//function to pass reading levels from the issues to use in the views
async function getReadingLevels() {
    const readingLevels = await Issues.findAll({
        attributes: ['reading_level'],
        group: ['reading_level'],
    }).then(issues => issues.map(issue => issue.reading_level))
    readingLevels.sort();
    return readingLevels
}

module.exports = router;
