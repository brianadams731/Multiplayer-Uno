'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "State"(
        gid INTEGER NOT NULL REFERENCES "Game" (id),
        started BOOLEAN NOT NULL DEFAULT FALSE,
        last_card_played INTEGER REFERENCES "Lookup" (lid),
        current_turn INTEGER REFERENCES "User" (uid),
        modifier varchar(30),
        PRIMARY KEY (gid)
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE "State";
    `)
  }
};
