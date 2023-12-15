const sequelize = require('../config/connection');
const User = require('../models/User');
const Issues = require('../models/Issues');
const SourceMaterial = require('../models/SourceMat');

const testUserData = require('./testuser.json');
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
    process.exit(0);
};

seedDatabase();