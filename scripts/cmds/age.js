module.exports = {
	config: {
		name: "age",
		version: "1.0",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			vi: "Tính tuổi của bạn",
			en: "Calculate your age"
		},
		category: "utility",
		guide: {
			en: "{pn} <dd/mm/yyyy>\nExample: {pn} 15/08/2000"
		}
	},

	langs: {
		vi: {
			invalidFormat: "Định dạng ngày không hợp lệ. Vui lòng nhập theo định dạng dd/mm/yyyy",
			invalidDate: "Ngày sinh không hợp lệ",
			futureDate: "Ngày sinh không thể là ngày trong tương lai",
			result: "🎂 Tuổi của bạn là: %1 tuổi %2 tháng %3 ngày"
		},
		en: {
			invalidFormat: "Invalid date format. Please enter in dd/mm/yyyy format",
			invalidDate: "Invalid birth date",
			futureDate: "Birth date cannot be in the future",
			result: "🎂 Your age is: %1 years %2 months %3 days"
		}
	},

	onStart: async function ({ message, args, getLang }) {
		const input = args[0];
		if (!input || !/^\d{2}\/\d{2}\/\d{4}$/.test(input))
			return message.reply(getLang("invalidFormat"));

		const [day, month, year] = input.split("/").map(Number);
		const birthDate = new Date(year, month - 1, day);

		if (
			birthDate.getFullYear() !== year ||
			birthDate.getMonth() !== month - 1 ||
			birthDate.getDate() !== day
		)
			return message.reply(getLang("invalidDate"));

		const now = new Date();
		if (birthDate > now)
			return message.reply(getLang("futureDate"));

		let years = now.getFullYear() - birthDate.getFullYear();
		let months = now.getMonth() - birthDate.getMonth();
		let days = now.getDate() - birthDate.getDate();

		if (days < 0) {
			months--;
			const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
			days += prevMonth.getDate();
		}
		if (months < 0) {
			years--;
			months += 12;
		}

		return message.reply(getLang("result", years, months, days));
	}
};
