const sequelize = require('../config/connection');
const User = require('../models/User');
const Issues = require('../models/Issues');
const SourceMaterial = require('../models/SourceMat');

const testUserData = require('./testuser.json');
const issuesData = require('./issues.json');
const sourceMaterialData = require('./sourcematerial.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true});

    const readers = await User.bulkCreate(testUserData, {
        individualHooks: true,
        returning: true
    });
    const sourceMaterials = await SourceMaterial.bulkCreate(sourceMaterialData, {
        individualHooks: true,
        returning: true
    });

    // create some issues linked to the first user and first source material in the seed
    issuesData.forEach(issue => {
        issue.user_id = readers[0].dataValues.user_id
        issue.source_mat_id = sourceMaterials[0].dataValues.source_mat_id
    })
    issuesData[0].user_id = readers[1].dataValues.user_id
    issuesData[0].source_mat_id = sourceMaterials[1].dataValues.source_mat_id
    const issues = await Issues.bulkCreate(issuesData, {
        individualHooks: true,
        returning: true
    });
    process.exit(0);
};

seedDatabase();