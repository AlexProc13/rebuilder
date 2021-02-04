const express = require('express');
const exec = require('child_process').exec;
const fs = require("fs");

const app = express();
const PORT = 7777;

app.use(express.json());

app.get('/rebuild', (request, response) => {
  let platform = request.query.platform;
  //let dir = `/var/www/${platform}`;
  let command = `cd ${dir} && npm run build`;

  if (fs.existsSync(dir)) {
    exec(command, function callback(error, stdout, stderr){
      // result
      console.log(error);
    });
  }
  response.send('Ok');
});

app.listen(PORT, () => console.log(`Server currently running on port ${PORT}`));