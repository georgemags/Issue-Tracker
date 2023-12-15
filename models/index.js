const User = require('./User');
const Issues = require('./Issues');
const SourceMaterial = require('./SourceMat');

User.hasMany(Issues, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
Issues.belongsTo(User, {
    foreignKey:'user_id'
});

SourceMaterial.hasMany(Issues, {
    foreignKey: 'source_mat_id',
    onDelete: 'CASCADE'
});

Issues.belongsTo(SourceMaterial, {
    foreignKey:'source_mat_id'
});

module.exports = { User, Issues, SourceMaterial };