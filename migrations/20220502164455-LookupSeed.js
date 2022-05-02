'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DELETE from "Lookup";
    `)

    const tempArray = []; 
    const value = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'skip', 'reverse', 'drawtwo']
    const color = ['red', 'yellow', 'blue', 'green']
  
    color.forEach((color)=>{
      value.forEach((val)=>{
        tempArray.push({
          color,
          val
        })
      })
    })
  
    color.forEach(()=>{
      tempArray.push({
        color: null,
        val: "wildcard"
      });
      tempArray.push({
        color: null,
        val: "drawfour"
      })
    })

    return queryInterface.bulkInsert("Lookup",
      tempArray
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DELETE from "Lookup";
    `)
  }
};
