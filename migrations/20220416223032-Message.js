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
      CREATE TABLE "Messages" (
        gid SERIAL PRIMARY KEY,
        uid SERIAL,
        message VARCHAR(100)
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TABLE "Messages";`
    )
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
