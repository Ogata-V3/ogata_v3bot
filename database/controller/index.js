const { graphQlQueryToJson } = require("graphql-query-to-json");
const ora = require("ora");
const { log: _log, getText: _getText } = global.utils || {};
const log = _log || { info: console.log, warn: console.warn, err: console.error, error: console.error, master: console.log };
const getText = _getText || ((k1, k2, ...a) => a.join(" ") || k2 || k1);

// SAFE GUARD (FIX CRASH)
const goatbot = global.GoatBot || { config: { database: { type: "sqlite" } } };
const config = goatbot.config || { database: { type: "sqlite" } };

const databaseType = config?.database?.type || "sqlite";

// with add null if not found data
function fakeGraphql(query, data, obj = {}) {
	if (typeof query != "string" && typeof query != "object")
		throw new Error(`The "query" argument must be of type string or object, got ${typeof query}`);
	if (query == "{}" || !data)
		return data;
	if (typeof query == "string")
		query = graphQlQueryToJson(query).query;
	const keys = query ? Object.keys(query) : [];
	for (const key of keys) {
		if (typeof query[key] === 'object') {
			if (!Array.isArray(data[key]))
				obj[key] = data.hasOwnProperty(key) ? fakeGraphql(query[key], data[key] || {}, obj[key]) : null;
			else
				obj[key] = data.hasOwnProperty(key) ? data[key].map(item => fakeGraphql(query[key], item, {})) : null;
		}
		else
			obj[key] = data.hasOwnProperty(key) ? data[key] : null;
	}
	return obj;
}

module.exports = async function (api) {
	var threadModel, userModel, dashBoardModel, globalModel, sequelize = null;

	switch (databaseType) {
		case "mongodb": {
			const spin = ora({
				text: getText('indexController', 'connectingMongoDB'),
				spinner: {
					interval: 80,
					frames: ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']
				}
			});

			const defaultClearLine = process.stderr.clearLine;
			process.stderr.clearLine = function () { };

			spin.start();
			try {
				var { threadModel, userModel, dashBoardModel, globalModel } =
					await require("../connectDB/connectMongoDB.js")(config?.database?.uriMongodb || "");

				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				log.info("MONGODB", getText("indexController", "connectMongoDBSuccess"));
			}
			catch (err) {
				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				log.err("MONGODB", getText("indexController", "connectMongoDBError"), err);
				return; // SAFE EXIT (no crash loop)
			}
			break;
		}

		case "sqlite": {
			const spin = ora({
				text: getText('indexController', 'connectingSQLite'),
				spinner: {
					interval: 80,
					frames: ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']
				}
			});

			const defaultClearLine = process.stderr.clearLine;
			process.stderr.clearLine = function () { };

			spin.start();
			try {
				var { threadModel, userModel, dashBoardModel, globalModel, sequelize } =
					await require("../connectDB/connectSQLite.js")();

				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				log.info("SQLITE", getText("indexController", "connectSQLiteSuccess"));
			}
			catch (err) {
				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				log.err("SQLITE", getText("indexController", "connectSQLiteError"), err);
				return; // SAFE EXIT (no crash loop)
			}
			break;
		}

		case "json": {
			const spin = ora({
				text: getText('indexController', 'loadingJSON'),
				spinner: {
					interval: 80,
					frames: ['⠋','⠙','⠹','⠸','⠼','⠴','⠦','⠧','⠇','⠏']
				}
			});

			const defaultClearLine = process.stderr.clearLine;
			process.stderr.clearLine = function () { };

			spin.start();
			try {
				var { threadModel, userModel, dashBoardModel, globalModel } =
					await require("../connectDB/connectJSON.js")();

				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				log.info("JSON", getText("indexController", "loadJSONSuccess"));
			}
			catch (err) {
				spin.stop();
				process.stderr.clearLine = defaultClearLine;
				log.err("JSON", getText("indexController", "loadJSONError"), err);
				return; // SAFE EXIT (no crash loop)
			}
			break;
		}

		default: {
			log.err("DATABASE", `Unknown database type: ${databaseType}`);
			process.exit(1);
		}
	}

	// Load all data
	try {
		const allThreadData = await (threadModel?.getAll?.() || Promise.resolve([]));
		const allUserData = await (userModel?.getAll?.() || Promise.resolve([]));
		const allDashBoardData = await (dashBoardModel?.getAll?.() || Promise.resolve([]));
		const allGlobalData = await (globalModel?.getAll?.() || Promise.resolve([]));

		global.db.allThreadData = allThreadData || [];
		global.db.allUserData = allUserData || [];
		global.db.allDashBoardData = allDashBoardData || [];
		global.db.allGlobalData = allGlobalData || [];

		global.db.threadModel = threadModel;
		global.db.userModel = userModel;
		global.db.dashboardModel = dashBoardModel;
		global.db.globalModel = globalModel;

		global.db.threadsData = threadModel;
		global.db.usersData = userModel;
		global.db.dashBoardData = dashBoardModel;
		global.db.globalData = globalModel;
	}
	catch (err) {
		log.warn("DATABASE", "Failed to load data:", err.message);
	}

	return {
		threadModel: threadModel || null,
		userModel: userModel || null,
		dashBoardModel: dashBoardModel || null,
		globalModel: globalModel || null,
		threadsData: threadModel || null,
		usersData: userModel || null,
		dashBoardData: dashBoardModel || null,
		globalData: globalModel || null,
		sequelize: sequelize || null,
		databaseType
	};
};
