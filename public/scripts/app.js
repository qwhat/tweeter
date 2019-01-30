$(document).ready( function (){                                                 //executes function once the DOM loads
  const rootURL = "http://localhost:8080";                                      //defines URL path

  function renderTweets(tweets) {                                               //this function renders the tweets on the page

    $("#tweets-container").empty()                                              //empties the tweet-container and reloads it to not have duplicate messages and "refreshes" the page
    for (tweet of tweets) {                                                     //loops over each tweet passed in argument "tweets"
      const tweeterPost = createTweetElement(tweet);                            //assign an element to a function that is defined below
      $("#tweets-container").prepend(tweeterPost);                              //prepends the tweeterPost from previous line to the #tweets-container
    }
  };

  const loadTweets = () => {                                                    //function that loads the tweets from the database when called (on line 79)
    const tweetLog =
    $.ajax("/tweets", {                                                         //ajax function that pulls data from the tweets.json
      method: "GET",
      dataType: "json",
    }).then(function(data) {
    renderTweets(data)                                                          //executes rendertweets function with the "hardcoded" initial tweets
    })
  };

  function createTweetElement (tweet) {                                         //this function creates the container every time the page is loaded or a new tweet is posted
    const avatar = tweet.user.avatars.regular;                                  //pulled from the "hardcoded" initial tweets
    const userName = tweet.user.name;                                           //pulled from the "hardcoded" initial tweets
    const handle = tweet.user.handle;                                           //pulled from the "hardcoded" initial tweets
    const textPost = tweet.content.text;                                        //pulled from the "hardcoded" initial tweets OR from our textarea
    const timeStamp = tweet.created_at;                                         //pulled from the "hardcoded" initial tweets OR defined when we click the submit button in new tweet
    const timeAgo = moment(timeStamp).fromNow();                                //moment.js function that takes time in milliseconds and determines how long ago it was from when rendered

    const $tweet = $("<article>").addClass("tweet");                            //creates the article html element and assigns the tweet class to it

    const header = $("<header>");                                               //creates the header html element for the article
    $("<img>").addClass("profile-pic").attr("src", avatar).appendTo(header);    //creates an img html element, assigns it a class, an attribute "src" and then appends it to the header element
    $("<h2>").addClass("name").text(userName).appendTo(header);                 //creates an h2 html element and assigns it a class, some text and appends it to the article after the img
    $("<span>").addClass("handle").text(handle).appendTo(header);               //creates a span html element and assigns it a class, some text and appends it to the article after the h2
    $tweet.append(header);                                                      //appends the header to the article after defining the 3 html elements inside of it

    const message = $("<p>").text(textPost);                                    //creates the p html element and assigns it text (defined by const textPost)
    $tweet.append(message);                                                     //appends p to the article

    const foot = $("<footer>").text(timeAgo);                                   //creates the footer html element and assigns it text (defined by const timeAgo)
    $tweet.append(foot);                                                        //appends footer to the article

    return $tweet;                                                              //returns the article to whatever called the function
  };

  const submitTweet = $("input").click(function(event) {                        //executes when the tweet button is submitted
    event.preventDefault();                                                     //prevents default event
    const message = $(".new-tweet textarea").serialize();                       //defines the text inside the tweet text area

    if (message.substr(5).split("+").join("").split("%0D%0A").join("").length === 0) {    //checks to see if textarea is "whitespace" (spaces and line breaks)
      $(".errorMessage").slideUp("fast", function(){                            //slides up then executes function
        $(this).slideDown("fast").text("Error: nothing to Post")                //slide down and display error message
      })
    } else if (message.substr(5).length > 140) {                                //checks if textarea has more than the allowed 140 characters(including spaces and line breaks)
      $(".errorMessage").slideUp("fast", function(){                            //slides up then executes function
        $(this).slideDown("fast").text("Error: too many characters.")           //slide down and display error message
      })
    } else {
      $.ajax("/tweets", {                                                       //ajax function to post data (our tweet)
        method: "POST",
        data: message,
      }).then(function(data) {                                                  //then execute function
        loadTweets(message);                                                    //executes function loadtweets on the message var
        $(".new-tweet textarea").val("");                                       //empties the textarea
        $(".errorMessage").text("")                                             //removes the error message
        $(".counter").text(140)                                                 //resets  the counter
      })
    }
  });

  $("#miyagi").click(function(){                                                //executes function when element with id "miyagi" is clicked
    if ($("#miyagi").hasClass("composing")) {                                   //checks if tweet has class composing (this if else statement is for css reasons only)
      $("#miyagi").removeClass("composing")
    } else {
      $("#miyagi").addClass("composing")
    }
    $(".new-tweet").slideToggle()                                               //slides the element with class new-tweet up or down depending if the element is hidden or not
    $(".new-tweet textarea").focus();                                           //when the button is clicked focuses in on textarea so the user does not need to click the textbox
  });

  loadTweets();                                                                 //executes the loadTweets function upon DOM ready
});
