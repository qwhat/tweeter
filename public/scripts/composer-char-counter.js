$(document).ready(function() {                                                  //executes function once DOM finishes loading
  $("textarea").on("input", function() {                                        //on key input, execute function
    let char = this.value;                                                      //defines current value of textarea each time input is logged
    let leftChar = 140 - char.length;                                           //defines the number the user sees in the count span
    let parent = this.closest("form");                                          //goes up the DOM tree to closest <form> parent
    let counter = $(parent).contents(".counter");                               //goes back down the DOM tree to element with class="counter"
    if (leftChar >= 0) {
      $(counter).css("color", "#244751");                                       //sets the text color to black
      $(counter).text(leftChar);                                                //displays "remaining characters"
    } else {
      $(counter).css("color", "red");                                           //sets the text color to red when past 140 characters
      $(counter).text(leftChar);                                                //displays "remaining characters"(it would be negative numbers here)
    }
  });
});
