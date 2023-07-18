const config = {
	client: 'pg',
	connection: process.env.POSTGRES_URL + "?sslmode=require",
	searchPath: ['knex', 'public'],
};
 
module.exports = require('knex')(config);