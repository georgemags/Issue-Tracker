const Sequelize = require('sequelize');
require('dotenv').config();

let sequelize;

if (process.env.POSTGRES_DB) {
  sequelize = new Sequelize(postgres://issue_tracker_postgres_db_user:POFbKzVO1H7HuwDuF3TXXwt0GtTTGty6@dpg-cltrs7i1hbls73e6feg0-a.ohio-postgres.render.com/issue_tracker_postgres_db?ssl=true);
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: 'localhost',
      dialect: 'mysql',
      port: 3306
    }
  );
}

module.exports = sequelize;
