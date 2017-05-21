$(document).foundation();

var searchDropdown = $('#search-dropdown');
var textBox = $('#middle-label');
textBox.get(0).onclick = undefined;
textBox.on('input', function() {
  console.log(textBox.val())
  if (textBox.val().length > 0) {
    autocompleteText();
  } else {
    searchDropdown.removeClass('is-open');
  }
})
textBox.blur(function() {
  console.log('blur')
  searchDropdown.removeClass('is-open');
})

function autocompleteText() {
  $.getJSON('https://uprvn9yff5.execute-api.us-east-1.amazonaws.com/v1/autocomplete?query=' + textBox.val(), function(data){
    searchDropdown.empty();
    data.forEach(function(person) {
      var prettyId = prettifyId(person.id);
      var aElem = $('<a>').prop('id', prettyId).prop('href', window.location + '/#' + prettyId);
      var liElem = $('<li>');
      if (person.image) {
        liElem.append($('<img>').prop('src', person.image));
      }
      liElem.append($('<div>').append($('<b>').text(person.name)).append($('<p>').text(person.description)));
      aElem.append(liElem);
      searchDropdown.append(aElem);
    });
    searchDropdown.addClass('is-open');
  });
  
  
  
  /*
            <a href="http://google.com">
              <li>
                <img src="https://media3.s-nbcnews.com/j/newscms/2016_20/1541946/160518-trump-portrait-jsw-145p_1c226e6636be4572928409c157f0d50a.nbcnews-ux-2880-1000.jpg" />
                <div>
                  <b>Donald Trump</b>
                  <p>Donald John Trump (born June 14, 1946) is the 45th and current President of the United States. Before entering politics, he was a businessman and television personality. </p>
                </div>
                <div class="status">
                  <!-- Add "doneload" class to spinner when finished to hide it, or just set display to none-->
                  <div class="spinner doneload">
                    <div class="double-bounce"></div>
                  </div>
                  <!--Add/change to "isalive" or "isdead" after removing the spinner.-->
                  <div class="result isalive"></div>
              </div>
              </li>
            </a>
  */
}

function prettifyId(id) {
  return id.slice(1).replace('/', ':')
}

function unPrettifyId(id) {
  return '/' + id.replace(':', '/')
}