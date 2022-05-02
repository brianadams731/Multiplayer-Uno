'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "Card";
    `)
    
    await queryInterface.sequelize.query(`
      CREATE TABLE "Card"(
        uid INTEGER REFERENCES "User" (uid),
        gid INTEGER NOT NULL REFERENCES "Game" (id) ON DELETE CASCADE,
        ref INTEGER NOT NULL REFERENCES "Lookup" (lid),
        PRIMARY KEY (gid, ref)
      );
    `)

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE "Card";
    `)
  }
};
