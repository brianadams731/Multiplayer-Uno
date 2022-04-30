'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE "GameUser"(
        uid INTEGER REFERENCES "User" (uid),
        gid INTEGER REFERENCES "Game" (id),
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
