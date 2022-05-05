'use strict';

module.exports = {
  // since inserts will always occur at the last index (this is on a timestamp column), this provides quicker search/sorts with
  // very minimal overhead added to insertions, leave this unless there is an explicit reason to remove
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE INDEX gu_date
      ON "GameUser"(time_joined);
    `)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP INDEX gu_date
      ON "GameUser(time_joined);
    `)
  }
};
