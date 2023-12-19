const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const issueRoutes = require('./issue-routes.js')

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/issues', issueRoutes);

module.exports = router;