/**
 * DataModel
 * Wraps a raw Sequelize model (schema: { key: STRING PK, data: JSON })
 * and exposes the get/set/getAll/create/delete API expected by
 * loadScripts.js, login.js and command/event scripts.
 *
 * Usage pattern expected by the bot:
 *   await globalData.get('setalias', 'data', [])      -> returns row.data.data or []
 *   await globalData.set('setalias', value, 'data')   -> sets row.data.data = value
 *   await globalData.getAll()                         -> returns array of all rows
 */
class DataModel {
	constructor(model) {
		this.model = model;
		this.primaryKey = model.primaryKeyAttribute || "key";
	}

	// Return all rows as plain objects: { [primaryKey]: ..., ...data }
	async getAll() {
		const rows = await this.model.findAll();
		return rows.map(row => {
			const plain = row.get({ plain: true });
			const data = plain.data || {};
			return { [this.primaryKey]: plain[this.primaryKey], ...data, data };
		});
	}

	// get(key) -> full data object for that key
	// get(key, prop) -> data[prop]
	// get(key, prop, defaultValue) -> data[prop] ?? defaultValue
	async get(key, prop, defaultValue) {
		const row = await this.model.findByPk(key);
		const data = (row && row.data) || {};

		if (prop === undefined) {
			return row ? data : defaultValue;
		}

		return Object.prototype.hasOwnProperty.call(data, prop) ? data[prop] : defaultValue;
	}

	// set(key, value) -> merge value object into data
	// set(key, value, prop) -> set data[prop] = value
	async set(key, value, prop) {
		let row = await this.model.findByPk(key);
		if (!row) {
			row = await this.model.create({ [this.primaryKey]: key, data: {} });
		}

		const data = { ...(row.data || {}) };

		if (prop !== undefined) {
			data[prop] = value;
		} else if (value && typeof value === "object") {
			Object.assign(data, value);
		}

		row.data = data;
		row.changed("data", true);
		await row.save();
		return row.data;
	}

	async create(key, data = {}) {
		const existing = await this.model.findByPk(key);
		if (existing) return existing;
		return this.model.create({ [this.primaryKey]: key, data });
	}

	async delete(key) {
		return this.model.destroy({ where: { [this.primaryKey]: key } });
	}
}

module.exports = DataModel;
