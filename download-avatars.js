var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request'
    }
  };

  request(options, function(err, res, body) {
    cb(err, body);
  });

}

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
         throw err; 
  })

  .on('response', function (response) {
    console.log('Response Status Message: ' + response.statusMessage +
      ' of Content Type: ' + response.headers['content-type']);
  })

  .pipe(fs.createWriteStream(filePath));
}

//Test on this repo at some point: https://github.com/nodejs/node
getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);

  var data = JSON.parse(result);

  data.forEach(function (obj) {
    console.log('\n');
    var fp = "./avatar" + obj.name + ".jpg";
    downloadImageByURL(obj.avatar_url, fp);
    console.log('\n');
  });
});
