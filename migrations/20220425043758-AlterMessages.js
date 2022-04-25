'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS "Messages";
    `)

    await queryInterface.sequelize.query(`
      CREATE TABLE "Message"(
        mid SERIAL PRIMARY KEY,
        uid INTEGER,
        content TEXT,
        FOREIGN KEY(uid) REFERENCES "User"(uid)
      );
    `)
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE "Message"
    `)
  }
};
