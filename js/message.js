$(document).ready(function(){
    'use strict';
  $('button').click(function(){
    var value = $('textarea.message').val();
    if(value != ''){
      var message = $('li.message').first().clone();
      $(message).find('p.text').html(value);
      $('ul.messages').append(message);
      $('textarea.message').val('');
      $('html, body').animate({ scrollTop: $(document).height() }, 700);
      $('textarea.message').removeClass('required');
    } else {
      $('textarea.message').addClass('required');
    }
  });
});