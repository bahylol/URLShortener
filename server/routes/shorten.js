const {
    isEmpty
} = require('lodash');
const db = require('../connectors/db');
const bodyParser = require('body-parser');


function generateRandomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

module.exports = function (app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.post('/shorten', async function (req, res) {
        const server = process.env.url;
        const {
            oldUrl
        } = req.body;
        if (!oldUrl) {
            return res.status(400).send("Please enter Url");
        }
        try {
            const testOldUrl = new URL(oldUrl);
        } catch (e) {
            return res.status(400).send("Invalid Url");
        }

        try {
            let test, newUrl;
            do {
                newUrl = generateRandomString(16);
                const date = new Date();
                const days = 14;
                const dateBefore = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000)).toISOString().slice(0, 19).replace('T', ' ');
                test = await db.select("*").from("urls").where("short", newUrl).andWhere('date', '>', dateBefore);
            }
            while (!isEmpty(test));
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