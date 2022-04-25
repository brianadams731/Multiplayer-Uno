'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    let val = ['zero','one','two','three','four','five','size','seven','eight','nine','skip','reverse','drawtwo']
    let color = ['red','yellow','blue','green']

    let num = 1;
    let array = [];

    for(let [, x] of color.entries()){
      for(let [, y] of val.entries()){
        let tempArray = [];
        tempArray.push(num);
        tempArray.push(x);
        tempArray.push(y);
        num++;
        array.push(tempArray);
      }
    }

    array.push([num++, 'any', 'wild']);
    array.push([num++, 'any', 'wildfour']);

    console.log(array);

    await Promise.all(
      array.map(element => {
        return queryInterface.sequelize.query(
          `INSERT INTO "Lookup" (lid, color, val) VALUES ($1, $2, $3);`,
          {
            bind: element,
            type: Sequelize.QueryTypes.SELECT
          }
        )
      })
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `TRUNCATE "Lookup";`
    )
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
