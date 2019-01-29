$(document).ready( function (){
  const rootURL = "http://localhost:8080";

  function renderTweets(tweets) {

    $("#tweets-container").empty()
    for (tweet of tweets) {
      const tweeterPost = createTweetElement(tweet);
      $("#tweets-container").prepend(tweeterPost);
    };
  };

  const loadTweets = () => {
    const tweetLog =
    $.ajax("/tweets", {
      method: "GET",
      dataType: "json",
    }).then(function(data) {
    renderTweets(data)
    })
  };

  function createTweetElement (tweet) {
    const avatar = tweet.user.avatars.regular;
    const userName = tweet.user.name;
    const handle = tweet.user.handle;
    const textPost = tweet.content.text;
    const timeStamp = tweet.created_at;
    const timeAgo = moment(timeStamp).fromNow();
    const $tweet = $("<article>").addClass("tweet");
    const header = $("<header>");
    $("<img>").addClass("profile-pic").attr("src", avatar).appendTo(header);
    $("<h2>").addClass("name").text(userName).appendTo(header);
    $("<span>").addClass("handle").text(handle).appendTo(header);
    $tweet.append(header);
    const message = $("<p>").text(textPost);
    $tweet.append(message);
    const foot = $("<footer>").text(timeAgo);
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
  });

  $("#miyagi").click(function(){
    if ($("#miyagi").hasClass("composing")) {
      $("#miyagi").removeClass("composing")
    } else {
      $("#miyagi").addClass("composing")
    }
    $(".new-tweet").slideToggle()
    $(".new-tweet textarea").focus();
  });

  loadTweets();
});
