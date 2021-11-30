const express = require('express');
const exec = require('child_process').exec;
const fs = require("fs");

const app = express();
const PORT = 7777;

app.use(express.json());

app.get('/rebuild', (request, response) => {
    let command = getCommand(request);

    exec(command, function callback(error, stdout, stderr) {
        // result
        console.log(error);
    });

    return response.json({status: true})
});

app.get('/asyncRebuild', async (request, response) => {
    let command = getCommand(request);

    try {
        let result = await execPromise(command);
        console.log(result);
        return response.json({status: true, msg: result});
    } catch (e) {
        return response.json({status: false});
    }
});

function execPromise(command) {
    return new Promise(function(resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(stdout.trim());
        });
    });
}

function getCommand(request) {
    let platform = request.query.platform;
    if (platform == 'undefined') {
        return response.json({status: false})
    }

    const dirPath = '/var/www/';
    platform = platform.replace(/[^a-z0-9.]/gi, '');
    let dir = dirPath + `${platform}`;
    console.log(platform);
    if (platform == '' || !fs.existsSync(dir)) {
        return response.json({status: false})
    }

    return  command = `cd ${dir} && npm run build`;
}

app.listen(PORT, () => console.log(`Server currently running on port ${PORT}`));
