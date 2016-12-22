const request    = require('request');
const cheerio    = require('cheerio');
const express    = require('express');
const port       = process.env.PORT || 3000;
const app        = express();
const router     = express.Router();
const bodyParser = require("body-parser");


// router.route('/')
// .get(links);

// router.route('/')
// .post(linksIndex);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/', linksIndex);
app.post('/peerflix', peerflix);


app.get('/*', (req, res) =>  res.sendFile(__dirname + '/index.html'));

app.listen(port, () => console.log(`Running on port: ${port}`));

function peerflix(req, res) {
  var exec = require('child_process').exec,
  child;

  child = exec('peerflix "'+ req.body.magnet +'" --vlc', function (error, stdout, stderr){
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

function linksIndex(req, res) {
  var arr = [];

  request(`https://pirateproxy.vip/search/${req.body.search}`, function (error, response, html) {
    if (!error && response.statusCode === 200) {
      var $ = cheerio.load(html);
      $('a').each(function(i, element){
        // console.log(element);
        var a = $(this).prev();
        if (a.attr('href') !== undefined && a.attr('href').length > 30) {
          var link = (a.attr('href'));
          if (link[0] !== '/') arr.push(link.split('&')[0]);
        }
      });
    }
    console.log(arr);
    return res.send(arr);
  });
}
