const {
    isEmpty
} = require('lodash');
const db = require('../connectors/db');
const bodyParser = require('body-parser');

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.post('/customShorten', async function (req, res) {
        const server = process.env.url;
        const {
            oldUrl,
            newUrl
        } = req.body;
        if (!oldUrl) {
            return res.status(400).send("Please enter Url");
        }
        if (!newUrl) {
            return res.status(400).send("Please enter Url");
        }
        if(newUrl.length>30){
            return res.status(400).send("New Url is too long");
        }
        try {
            const testOldUrl = new URL(oldUrl);
        } catch (e) {
            return res.status(400).send("Invalid Url");
        }

        try {
            const testDate = new Date();
            const days = 14;
            const dateBefore = new Date(testDate.getTime() - (days * 24 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
            let test = await db.select("*").from("urls").where("short", newUrl).andWhere('date', '>', dateBefore);
            if (!isEmpty(test)) {
                return res.status(400).send("Url is already in use");
            }
            const today = new Date();
            const date = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            const currentDate = year + '-' + month + '-' + date;

            const newLinkObj = {
                long: oldUrl,
                short: newUrl,
                date: currentDate
            };

            const newLink = await db('urls').insert(newLinkObj).returning('*');

            return res.status(200).send(server + "/" + newUrl);
        } catch (error) {
            return res.status(400).send("Could not shorten url");
        }
    });
};