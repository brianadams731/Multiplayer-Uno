'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
