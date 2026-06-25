module.exports = async function () {
	const { Sequelize } = require("sequelize");
	const path = __dirname + "/../data/data.sqlite";
	const sequelize = new Sequelize({
		dialect: "sqlite",
		host: path,
		logging: false
	});

	const DataModel = require("../DataModel.js");

	const rawThreadModel = require("../models/sqlite/thread.js")(sequelize);
	const rawUserModel = require("../models/sqlite/user.js")(sequelize);
	const rawDashBoardModel = require("../models/sqlite/userDashBoard.js")(sequelize);
	const rawGlobalModel = require("../models/sqlite/global.js")(sequelize);

	await sequelize.sync({ force: false });

	// Wrap raw Sequelize models so they expose .get()/.set()/.getAll()/.create()/.delete()
	const threadModel = new DataModel(rawThreadModel);
	const userModel = new DataModel(rawUserModel);
	const dashBoardModel = new DataModel(rawDashBoardModel);
	const globalModel = new DataModel(rawGlobalModel);

	return {
		threadModel,
		userModel,
		dashBoardModel,
		globalModel,
		sequelize
	};
};
