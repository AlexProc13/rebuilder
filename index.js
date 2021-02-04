const express = require('express');
const exec = require('child_process').exec;
const fs = require("fs");

const app = express();
const PORT = 7777;

app.use(express.json());

app.get('/rebuild', (request, response) => {
    let platform = request.query.platform;
    if (platform == 'undefined') {
        return response.json({status: false})
    }

    platform = platform.replace(/[^a-z0-9.]/gi, '');
    let dir = `/var/www/${platform}`;
    console.log(platform);
    if (platform == null && !fs.existsSync(dir)) {
        return response.json({status: false})
    }

    let command = `cd ${dir} && npm run build`;
    console.log(command);
    exec(command, function callback(error, stdout, stderr) {
        // result
        console.log(error);
    });

    return response.json({status: true})
});

app.listen(PORT, () => console.log(`Server currently running on port ${PORT}`));