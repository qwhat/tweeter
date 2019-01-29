/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
 // Test / driver code (temporary). Eventually will get this from the server.
$(document).ready( function (){
  const rootURL = "http://localhost:8080";

  function renderTweets(tweets) {

    $("#tweets-container").empty()
    for (tweet of tweets) {
      const tweeterPost = createTweetElement(tweet);
      $("#tweets-container").prepend(tweeterPost);
    }
  };

  function createTweetElement (tweet) {
    var avatar = tweet.user.avatars.regular;
    var userName = tweet.user.name;
    var handle = tweet.user.handle;
    var textPost = tweet.content.text;
    var timeStamp = tweet.created_at + " days ago";

    const $tweet = $("<article>").addClass("tweet");
    const header = $("<header>").addClass("clearfix");
    $("<img>").addClass("profile-pic").attr("src", avatar).appendTo(header);
    $("<h2>").addClass("name").text(userName).appendTo(header);
    $("<span>").addClass("handle").text(handle).appendTo(header);
    $tweet.append(header);
    const message = $("<p>").text(textPost);
    $tweet.append(message);
    const foot = $("<footer>").text(timeStamp);
    $tweet.append(foot);
    return $tweet;
  };

  const submitTweet = $("input").click(function(event) {
    event.preventDefault();
    const message = $(".new-tweet textarea").serialize();
    const whiteSpaced = message;

    if (message.substr(5).split("+").join("").split("%0D%0A").join("").length === 0) {
      $(".errorMessage").slideUp("fast", function(){
        $(this).slideDown("fast").text("Error: nothing to Post")
      })
    } else if (message.substr(5).length > 140) {
      $(".errorMessage").slideUp("fast", function(){
        $(this).slideDown("fast").text("Error: too many characters.")
      })
    } else {
      $.ajax("/tweets", {
        method: "POST",
        data: message,
      }).then(function(data) {
        loadTweets(message);
        $(".new-tweet textarea").val("");
        $(".errorMessage").text("")
        $(".counter").text(140)
      })
    }
  })

  const loadTweets = () => {
    const tweetLog =
    $.ajax("/tweets", {
      method: "GET",
      dataType: "json",
    }).then(function(data) {
    renderTweets(data)
    })
  }
  loadTweets()

  $("#miyagi").click(function(){
    if ($("#miyagi").hasClass("composing")) {
      $("#miyagi").removeClass("composing")
    } else {
      $("#miyagi").addClass("composing")
    }
    $(".new-tweet").slideToggle()
    $(".new-tweet textarea").focus();
  });


});
