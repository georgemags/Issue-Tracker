const User = require('./User');
const Issues = require('./Issues');
const SourceMaterial = require('./SourceMat');

Issues.hasMany(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});
User.belongsTo(Issues, {
    foreignKey:'user_id'
});

Issues.hasMany(SourceMaterial, {
    foreignKey: 'source_mat_id',
    onDelete: 'CASCADE'
});

SourceMaterial.belongsTo(Issues, {
    foreignKey:'source_mat_id'
});

module.exports = { User, Issues, SourceMaterial };