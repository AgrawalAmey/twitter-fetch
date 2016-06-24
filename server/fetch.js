var Twitter = require('twitter'),
    credentials = require('./twitterCred.js'),
    mongoose = require('mongoose'),
    express = require('express');


function MongoConnection(){
    var self = this;

    //Estabilishing connection
    mongoose.connect('mongodb://127.0.0.1/tweet-fetch');

    // Create a new schema for our tweet data
    this.tweetSchema = new mongoose.Schema({
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

    //Model object
    this.Tweet = mongoose.model('tweet', this.tweetSchema);

    //Format a raw tweet
    this.formatTweet = function(tweet, sentiment){
        var tweetSchema = {
            twid: tweet['id'],
            author: tweet['user']['name'],
            avatar: tweet['user']['profile_image_url'],
            body: tweet['text'],
            date: tweet['created_at'],
            screenname: tweet['user']['screen_name'],
            sentiment: sentiment
        }
        return this.Tweet(tweetSchema);
    }

    //Create a new model instance with our object
    this.saveTweet = function(tweet){
        tweet.save(function(err, data) {
            if (err) {
                console.log("Something went wrong :(  \n" + err);
                return;
            } else {
                console.log('Tweet successfully stored.');
            }
        });       
    };
    //Get tweets from Db
    this.getTweets = function(req, res){
        self.Tweet.find({}, function(err,data){
            if(err) {
                console.log("Something went wrong :(  \n" + err);
                return;
            
            }else{
                res.json({data}); 
            }
        });  
    }
}

function TweetFetcher(){
    this.client = new Twitter(credentials);
    this.queryString = 'bhel -chat -spicy -puri -sweet -ate -eat -food -chinese -corn -pavbhaji -delicious -tasty lang:en ';  
    
    //Convert to mongo model instance and save it
    this.processTweets = function(tweets, sentiment, error){
        if(error){
            console.log("Something went wrong :( \n" + error);
            return;
        }
        tweets.statuses.forEach(function(data){
            data = mongoConnection.formatTweet(data, sentiment);
            mongoConnection.saveTweet(data);
        });
    };

    //Tweet fetcher
    this.getTweets = function(){
        var self = this;
        // Get possitive tweets
        this.client.get('search/tweets', {q: this.queryString + ':)'}, function(error, tweets, response) {
            self.processTweets(tweets, 'pos', error);   
        });
        
        //Get netagive tweets
        this.client.get('search/tweets', {q: this.queryString + ':('}, function(error, tweets, response) {
            self.processTweets(tweets, 'neg', error);  
        });
        
        //Get questions
        this.client.get('search/tweets', {q: this.queryString + '?'}, function(error, tweets, response) {
            self.processTweets(tweets, 'que', error);  
        });
    };
}

// Express server
function startExpressServer(){
    var app = express();
    
    //All static file
    app.use(express.static('./client/'));
    
    //For landing
    app.get('/', function(req, res){
        res.render('./client/index.html');
    })
    
    //To get tweets json
    app.get('/get_tweets', mongoConnection.getTweets);

    //Port number
    app.listen(3000, function () {
      console.log('Listening on port 3000!');
    });
}

mongoConnection = new MongoConnection();
tweetFetcher = new TweetFetcher();
tweetFetcher.getTweets();
startExpressServer();

//Get tweets every 10 mins
setInterval(function(){
    tweetFetcher.getTweets();
}, 600000);

