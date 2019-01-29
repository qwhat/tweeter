$(document).ready(function() {
  $("textarea").on('input', function() {
    let char = this.value;
    let leftChar = 140 - char.length;
    let parent = this.closest("form");
    let counter = $(parent).contents(".counter");
    if (leftChar >= 0) {
      $(counter).css('color', '#244751');
      $(counter).text(leftChar);
    } else {
      $(counter).css('color', 'red');
      $(counter).text(leftChar);
    }
  });
});
