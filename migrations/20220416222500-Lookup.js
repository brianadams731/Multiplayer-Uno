'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "Lookup" (
        lid SERIAL PRIMARY KEY,
        val VARCHAR(20),
        color VARCHAR(6));
    `)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TABLE "Lookup";`
    )
  }
};
