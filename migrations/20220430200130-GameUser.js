'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "GameUser"(
        uid INTEGER REFERENCES "User" (uid) ON DELETE CASCADE,
        gid INTEGER REFERENCES "Game" (id) ON DELETE CASCADE,
        time_joined TIMESTAMP DEFAULT NOW(),
        PRIMARY KEY (uid,gid)
      );
    `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE "GameUser";
    `)
  }
};
