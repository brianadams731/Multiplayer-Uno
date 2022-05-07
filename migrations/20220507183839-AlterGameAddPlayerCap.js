'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Game"
      ADD player_cap INTEGER NOT NULL DEFAULT 4; 
    `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Game"
      DROP COLUMN player_cap;
    `)
  }
};
