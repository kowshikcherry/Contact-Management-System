
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "otc", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "otc_expiry", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("users", "otc");
    await queryInterface.removeColumn("users", "otc_expiry");
  },
};
