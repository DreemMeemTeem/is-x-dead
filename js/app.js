$(document).foundation();

var searchDropdown = $('#search-dropdown');
var textBox = $('#middle-label');
textBox.get(0).onclick = undefined;
textBox.on('input', function() {
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
  $.getJSON('https://uprvn9yff5.execute-api.us-east-1.amazonaws.com/v1/autocomplete?query=' + textBox.val(), function(data) {
    searchDropdown.empty();
    data.forEach(function(person) {
      var prettyId = prettifyId(person.id);
      /*Changed a to span here to get ready for onClick*/
      var aElem = $('<span>').attr('person-id', prettyId)/*.prop('href', window.location + '/#' + prettyId)*/;
      var liElem = $('<li>');
      if (person.image) {
        liElem.append($('<img>').prop('src', person.image));
      }
      liElem.append($('<hgroup>').append($('<b>').text(person.name)).append($('<p>').text(person.description)));
      liElem.append($('<div>').addClass('status').append($('<div>').addClass('spinner')).append($('<div>').addClass('result')));
      aElem.append(liElem);
      searchDropdown.append(aElem);
    });
    searchDropdown.addClass('is-open');
    loadStatuses();
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

function loadStatuses() {
  var ids = searchDropdown.children().map(function() {
    return unPrettifyId($(this).attr('person-id'))
  }).toArray();
  $.getJSON('https://uprvn9yff5.execute-api.us-east-1.amazonaws.com/v1/query?ids=' + ids.join(','), function(people) {
    console.log(people)
    for (id in people) {
      console.log(id)
      var person = people[id];
      var elem = searchDropdown.find('[person-id="' + prettifyId(id) + '"]');
      console.log(elem)
      if (elem) {
        elem.find('.spinner').hide();
        elem.find('.result').addClass(person.status).show();
      }
    }
  });
}

function prettifyId(id) {
  return id.slice(1).replace('/', ':')
}

function unPrettifyId(id) {
  return '/' + id.replace(':', '/')
}
