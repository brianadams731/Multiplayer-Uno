'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "Game"(
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        password text
      );
    `);
  },
  async down(queryInterface, Sequelize) {
      await queryInterface.sequelize.query(`
        DROP TABLE "Game";
      `);
  },
};
