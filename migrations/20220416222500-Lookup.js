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
     CREATE TABLE "Lookup" (
       lid SERIAL PRIMARY KEY,
       val VARCHAR(10),
       color VARCHAR(6)
     );
   `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `DROP TABLE "Lookup";`
    )
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
