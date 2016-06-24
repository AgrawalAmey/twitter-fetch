var Twitter = require('twitter'),
    credentials = require('./twitterCred.js'),
    mongoose = require('mongoose'),
    express = require('express');

var client = new Twitter(credentials);

//Db
mongoose.connect('mongodb://localhost/tweet-fetch');

// Create a new schema for our tweet data
var tweetSchema = new mongoose.Schema({
    twid: {
        type: String,
        unique: true,
    },
    author: String,        
    avatar: String,        
    body: String,         
    date: Date,         
    screenname: String,        
    sentiment: String,        
},{strict: true});

var Tweet = mongoose.model('tweet', tweetSchema);

// Get possitive tweets
client.get('search/tweets', {q: 'bhel -chat -spicy -puri -sweet -ate -eat -food -chinese -corn -pavbhaji -delicious -tasty lang:en :)'}, function(error, tweets, response) {
    processTweets(tweets, 'pos', error);   
});

//Get netagive tweets
client.get('search/tweets', {q: 'bhel -chat -spicy -puri -sweet -ate -eat -food -chinese -corn -pavbhaji -delicious -tasty lang:en :('}, function(error, tweets, response) {
    processTweets(tweets, 'neg', error);  
});

//Get questions
client.get('search/tweets', {q: 'bhel -chat -spicy -puri -sweet -ate -eat -food -chinese -corn -pavbhaji -delicious -tasty lang:en ?'}, function(error, tweets, response) {
    processTweets(tweets, 'que', error);  
});

function processTweets(tweets, sentiment, error){
    if(error){
        console.log("Something went wrong :( \n" + error);
        return;
    }
    tweets.statuses.forEach(function(data){
        var tweet = {
            twid: data['id'],
            author: data['user']['name'],
            avatar: data['user']['profile_image_url'],
            body: data['text'],
            date: data['created_at'],
            screenname: data['user']['screen_name'],
            sentiment: sentiment
        }

        // Create a new model instance with our object
        var tmp = new Tweet(tweet);
        tmp.save(function(err, docs) {
            if (err) {
                console.log("Something went wrong :(  \n" + err);
            } else {
                console.log('Tweet successfully stored.');
            }
        });
    });
}

function getTweets(){
    Tweet.find({}, function(err,docs){
        if(err) {
            console.log("Something went wrong :(  \n" + err);
          
        }else{
            return docs;   
        }
    });  
}

console.log(getTweets());

// Express server
var app = express();

app.use(express.static('./client/'));

app.get('/', function(req, res){
    res.render('./client/index.html');
})

app.get('/get_tweets', function(req, res){
    res.json(getTweets);
});

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
