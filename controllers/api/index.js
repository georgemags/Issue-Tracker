const router = require('express').Router();
const issueRoutes = require('./issue-routes');

const userRoutes = require('./user-routes');

router.use('/users', userRoutes);
router.use('/issues', issueRoutes);

module.exports = router;
