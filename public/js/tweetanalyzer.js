var tweetsSkipped = 0;
var tweets

var tweetText;
var tweetUser;

var score = 0;
var storedTweets = [];
var correctAnswer = 0;
var chosenAnswer =-1;

PUBNUB.init({
    subscribe_key: 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe',
    ssl : (('https:' == document.location.protocol) ? true : false)
}).subscribe({
    channel: 'pubnub-twitter',
    message:  function(msg){ console.log(msg) },
   //}console.log(msg) }
    callback: processData
});

function processData(data) {
    if (data.place != null) {
        if (data.place.country_code == "US" || data.place.country_code == "UK" || data.place.country_code == "AU" || data.place.country_code == "CN" || data.place.country_code == "NZ") {// && data.place.place_type=="city"){// && data.country_code == "NZ") {

            tweetText = data.text;
            tweetUser = data.user.name;
            storeData(data);
        }
        else {
            tweetsSkipped++;
            //$("#skippedTweets").textContent = "tweets skipped" + tweetsSkipped;
            document.getElementById("skippedTweets").textContent = "Tweets skipped: " + tweetsSkipped;
        }
    }
}

function storeData(data) {
    for (var i = 0; i < storedTweets.length; i++) {
        if (storedTweets[i].user.name == data.user.name) {
            storedTweets = [];
        }
    }
    if (storedTweets.length < 3) {
        console.log(data.user.name);
        //if (data[0].data.name != data[0].data.name && storedTweets[0].user.name != data[0].user.name) {
          //  storedTweets.push(data);
        storedTweets[storedTweets.length] = data;
            if (storedTweets.length == 3) {
                setupQuestion();
            }
        }
    }
   


function setupQuestion() {
    correctAnswer= Math.round(Math.random(2));
    var chosenCorrectTweet = storedTweets[correctAnswer];

    $("#tweetText").text(chosenCorrectTweet.text);

    //put the tweet names in corresponding spot in radio menu
    $("#optRadio1").html("<input type=radio name=optradio img=" + storedTweets[0].user.profile_background_image_url+">" + storedTweets[0].user.name);
    $("#optRadio2").html("<input type=radio name=optradio >" + storedTweets[1].user.name);
    $("#optRadio3").html("<input type=radio name=optradio >" + storedTweets[2].user.name);

    $("#optRadio1").attr("src", $(this).attr(storedTweets[0].user.profile_background_image_url));
    $("#optRadio1").attr("src", $(this).find("img").attr("src"));

    console.log(storedTweets[0].user.profile_background_image_url);

    //set main image to chosen tweet profile pic image
    $("#tweetImage").attr("src",chosenCorrectTweet.user.profile_image_url_https);

    $("#score").text("Score: " +score);

}

$('#newTweetButton').on('click', function (e) {
    if (chosenAnswer == correctAnswer) {
        score++;
        $("#score").text("Score: "+ score);
    }
    else {
        score = 0;
    }

    storedTweets = [];
});

$('#optRadio1').on('click', function (e) {
    chosenAnswer = 0;
});

$('#optRadio2').on('click', function (e) {
    chosenAnswer = 1;
});

$('#optRadio3').on('click', function (e) {
    chosenAnswer = 2;
});

function resetData() {
    
}

//{"created_at":"Mon Jul 20 05:36:44 +0000 2015","id":623003587002568700,"id_str":"623003587002568704","text":"LESBiano te amo.","source":"<a href=\"http://twitter.com/download/android \" rel=\"nofollow\">Twitter for Android</a>","truncated":false,"in_reply_to_status_id":null,"in_reply_to_status_id_str":null,"in_reply_to_user_id":null,"in_reply_to_user_id_str":null,"in_reply_to_screen_name":null,"user":{"id":411198733,"id_str":"411198733","name":"tlasojtlalistli ","screen_name":"peralta_beto","location":"MÈXico. ","url":null,"description":"Sigo siendo el mismo pinche gordo sin autoestima pero delgado y guapo.","protected":false,"verified":false,"followers_count":358,"friends_count":123,"listed_count":2,"favourites_count":23855,"statuses_count":13112,"created_at":"Sun Nov 13 03:40:42 +0000 2011","utc_offset":-18000,"time_zone":"Central Time (US & Canada)","geo_enabled":true,"lang":"es","contributors_enabled":false,"is_translator":false,"profile_background_color":"1A1B1F","profile_background_image_url":"http://pbs.twimg.com/profile_background_images/886888886/38a49489d09c33a7f5b1b118f17b1bc7.jpeg ","profile_background_image_url_https":"https://pbs.twimg.com/profile_background_images/886888886/38a49489d09c33a7f5b1b118f17b1bc7.jpeg ","profile_background_tile":true,"profile_link_color":"2FC2EF","profile_sidebar_border_color":"000000","profile_sidebar_fill_color":"252429","profile_text_color":"666666","profile_use_background_image":true,"profile_image_url":"http://pbs.twimg.com/profile_images/620478786836889600/0BlmbLxM_normal.jpg ","profile_image_url_https":"https://pbs.twimg.com/profile_images/620478786836889600/0BlmbLxM_normal.jpg ","profile_banner_url":"https://pbs.twimg.com/profile_banners/411198733/1436980594 ","default_profile":false,"default_profile_image":false,"following":null,"follow_request_sent":null,"notifications":null},"geo":null,"coordinates":null,"place":{"id":"f431ebfbc7890439","url":"https://api.twitter.com/1.1/geo/id/f431ebfbc7890439.json ","place_type":"city","name":"Tulancingo de Bravo","full_name":"Tulancingo de Bravo, Hidalgo","country_code":"MX","country":"MÈxico","bounding_box":{"type":"Polygon","coordinates":[[[-98.505693,20.0521303],[-98.505693,20.208444],[-98.215107,20.208444],[-98.215107,20.0521303]]]},"attributes":{}},"contributors":null,"retweet_count":0,"favorite_count":0,"entities":{"hashtags":[],"trends":[],"urls":[],"user_mentions":[],"symbols":[]},"favorited":false,"retweeted":false,"possibly_sensitive":true,"filter_level":"low","lang":"es",