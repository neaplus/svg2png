'use strict';

const PORT = 1481,
    HOST = '0.0.0.0',
    express = require('express'),
    crypto = require('crypto'),
    execa = require('execa'),
    fs = require("fs"),
    app = express();
var logger = require('morgan');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.all('/', function (req, res, next) {
    function send(file) {
        res.sendFile(file, {
            headers: {
                'Content-Type': 'image/png'
            }
        });
    }

    let hash = crypto.createHash('md5').update(req.originalUrl).digest("hex");
    const storageLocation = `/tmp/storage/${hash}`;

    // cached file
    if (!(req.query.force) && fs.existsSync(storageLocation)) {
        return send(storageLocation);
    }

    // download and convert
    (async () => {
        const {
            stdout
        } = await execa('./export.sh', [req.query.q, storageLocation, req.query.bg || 'None']);
        send(storageLocation);
    })();
});

app.get('*', (req, res) => {
    res.send('svg2png proxy server');
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        error: err
    });
});

app.listen(PORT, HOST);
console.info(`Running on http://${HOST}:${PORT}`);