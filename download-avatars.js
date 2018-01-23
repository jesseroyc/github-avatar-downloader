var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

/* Takes command line arguments and troubleshoots
 */
if(process.argv.length !== 4) {
  console.log("Please enter two arguments of repoOwner and repoName " + process.argv.slice(2).length
    + " were entered...");
  return 0;
}
var repoOwner = process.argv.slice(2)[0];
var repoName = process.argv.slice(2)[1];

/* Takes repository owner and name, creates a link for a request
 * Header opens access to API
 */
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

/* Outputs diffrently based on how the request was handled
 * Downloads images from a URL
 */
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

//FIX ME: Test on this repo at some point: https://github.com/nodejs/node
getRepoContributors(repoOwner, repoName, function(err, result) {

  var data = JSON.parse(result);

  data.forEach(function (obj) {
    var fp = "./avatar" + obj.name + ".jpg" ;
    downloadImageByURL(obj.avatar_url, fp);
  });
});