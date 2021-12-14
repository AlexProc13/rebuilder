const express = require('express');
const exec = require('child_process').exec;
const fs = require("fs");
const app = express();
require('dotenv').config();
const PORT = process.env.SERVER_PORT || 7775;
const projectsPath = process.env.PROJECTS_PATH || '/var/www/';

app.use(express.json());

app.get('/rebuild', (request, response) => {
    let command = getCommand(request);

    exec(command, function callback(error, stdout, stderr) {
        // result
        console.log(error);
    });

    return response.json({status: true})
});

app.get('/syncRebuild', async (request, response) => {
    let command = getCommand(request);

    try {
        let result = await execPromise(command);
        console.log(result);
        return response.json({status: true, msg: result});
    } catch (e) {
        console.log(e);
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

    if (platform == undefined) {
        throw "wrong path";
        return response.json({status: false})
    }
    console.log(platform);
    const dirPath = projectsPath;
    console.log(dirPath);
    platform = platform.replace(/[^a-z0-9.]/gi, '');
    let dir = dirPath + `${platform}`;
    console.log(platform);
    if (platform == '' || !fs.existsSync(dir)) {
        throw "wrong path";
    }

    return  command = `cd ${dir} && npm run build`;
}

app.listen(PORT, () => console.log(`Server currently running on port ${PORT}`));
