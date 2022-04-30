'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "User" (
        uid SERIAL PRIMARY KEY,
        username varchar(30) UNIQUE,
        email text UNIQUE,
        password text
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TABLE "User";`
    )
  }
};
