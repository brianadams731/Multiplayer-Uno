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
      CREATE TABLE "Card" (
        cid SERIAL PRIMARY KEY,
        gid SERIAL,
        uid SERIAL,
        val smallint
      );
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TABLE "Card";`
    )
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
