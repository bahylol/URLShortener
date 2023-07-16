const { isEmpty } = require('lodash');
const db = require('../connectors/db');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.get('/:link', async function (req, res) {
        const { link } = req.params;
        try {
            const testDate = new Date();
            const days = 14;
            const dateBefore = new Date(testDate.getTime() - (days * 24 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
            let test = await db.select("*").from("urls").where("short", link).andWhere('date', '>', dateBefore);
            if (isEmpty(test)) {
                return res.status(400).send("Url doesnot exist");
            }

            return res.status(200).json(`${test[0].long}`);
        } catch (error) {
            return res.status(400).send("Could not redirect");
        }
    });
};