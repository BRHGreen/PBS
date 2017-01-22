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

  let arr = [];
  let arr2 = [];
  let show = req.body.show.replace(" ", "%20");
  let series = req.body.series;
  let episode = req.body.episode;

  if (series.length < 2) {
    series = `0${series}`;
  }
  if (episode.length < 2) {
    episode = `0${episode}`;
  }

  console.log(`https://pirateproxy.vip/search/${show}%20s${series}e${episode}`);
  var search = `https://pirateproxy.vip/search/${show}%20s${series}e${episode}`;


  request(search, function (error, response, html) {
    if (!error && response.statusCode === 200) {
      var $ = cheerio.load(html);
      $('a').each(function(i, element){
        var a = $(this).prev();

        var text = a.text();

        if (a.attr('href') !== undefined && a.attr('href').length > 30) {
          var link = (a.attr('href'));
          if (link[0] !== '/') arr.push(link.split('&')[0]);
        }

      });
    }
    return res.send(arr);
  });
}
