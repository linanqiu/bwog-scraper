var request = require('request').defaults({
  jar: true
});
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');

var url = 'http://bwog.com';

var csvWriter = require('csv-write-stream')
var writer = csvWriter()
writer.pipe(fs.createWriteStream('out.csv'))

function listPage(number, callback) {
  console.log('page ' + number);
  request(url + '/page/' + number, function (err, resp, body) {
    if (err) {
      throw err;
    }

    $ = cheerio.load(body);
    var posts = $('.blog-section').map(function (i, elem) {
      return $(this).find('a').attr('href');
    }).get();

    async.each(posts, scrapeComments, function (err) {
      if (err) {
        throw err;
      }
      callback();
    });
  });
}

function scrapeComments(post, callback) {
  request(post, function (err, resp, body) {
    if (err) {
      throw err;
    }

    $ = cheerio.load(body);
    var comments = $('.comment-body').map(function (i, elem) {
      var post = {};
      post.text = $(this).find('.reg-comment-body').find('p').text().trim();
      post.likeCount = $(this).find('.comment-meta').find('.like-count').text().trim();
      post.dislikeCount = $(this).find('.comment-meta').find('.dislike-count').text().trim();
      return post;
    }).get();

    console.log('post scraped: ' + post);
    writeComments(comments);
    callback();
  });
}

function writeComments(comments) {
  comments.forEach(function (comment) {
    writer.write(comment);
  });
}

var numbers = [];
for (var i = 0; i < 1000; i++) {
  numbers.push(i+1);
}

async.eachSeries(numbers, listPage, function (err) {
  console.log('done');
  writer.end();
});
