const config = {
	client: 'pg',
	connection: {
		host: 'localhost',
		port: 5432,
		user: 'postgres',
		password: 'postgres',
		database: 'URLShortener',
	},
};

module.exports = require('knex')(config);