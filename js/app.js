$(document).foundation();

var searchDropdown = $('#search-dropdown');
var textBox = $('#middle-label');
var statusPage = $('#status-page');

var personCache = {};
var personNames = {};

$(document).ready(function() {
  window.onhashchange();
})

//textBox.get(0).onclick = undefined;
textBox.on('input', function() {
  if (textBox.val().length > 0) {
    autocompleteText();
  } else {
    searchDropdown.removeClass('is-open');
  }
});
textBox.focus(function() {
  console.log('focus')
  searchDropdown.addClass('is-open');
});
/*textBox.focusout(function() {
  console.log('blur')
  searchDropdown.removeClass('is-open');
});*/

window.onhashchange = function() {
  if (location.hash.length > 1) {
    textBox.attr('placeholder', '');
    var id = unPrettifyId(location.hash.slice(1));
    $('.alive-celebration').hide();
    $.getJSON('https://uprvn9yff5.execute-api.us-east-1.amazonaws.com/v1/query?ids=' + id, function(people) {
      if (people.hasOwnProperty(id)) {
        var person = people[id];


        var label = person.name || personNames[id] || '';
        textBox.val(label);
        $('#person-name').text(label);

        $('#status-display').removeClass('alive dead unknown').addClass(person.status);
        if (person.image) {
          $('.profilepic').css('background-image', 'url(' + person.image + ')').show();
        } else {
          $('.profilepic').hide();
        }


        if (person.birthYear) {
          $('#yob').text(formatYear(person.birthYear));
        } else {
          $('#yob').text('Unknown');
        }
        if (person.deathYear) {
          $('#yod').text(formatYear(person.deathYear));
        } else {
          $('#yod').text('Unknown');
        }
        if (person.age) {
          $('#age').text(person.age);
        } else {
          $('#age').text('Unknown');
        }
        if (person.link) {
          $('#wikilink').show();
          $('#wikilink').attr('href', person.link);
        } else {
          $('#wikilink').hide();
        }

        if (person.status === 'alive') {
          $('#yod').parent().hide();
          $('#age').prev().text('Age');
          $('.alive-celebration').show();
        } else if (person.status === 'dead') {
          $('#yod').parent().show();
          $('#age').prev().text('Age at death');
        } else if (person.status === 'unknoen') {
          $('#yod').parent().show();
          $('#age').prev().text('Age');
        }
        $('.profile').show();
      } else {
        var label = personNames[id];
        if (label) {
          textBox.val(label);
          $('#person-name').text(label);
          $('#status-display').removeClass('alive dead unknown').addClass('unknown');
          $('.profilepic').hide();

          $('#yob').text('Unknown');
          $('#yod').text('Unknown');
          $('#age').text('Unknown');
          $('#wikilink').hide();
          $('.profile').show();
        } else {
          textBox.attr('placeholder', '?????');
          $('.profile').hide();
        }
      }
      statusPage.show();
    });
  } else {
    statusPage.hide();
  }
};

function autocompleteText() {
  $.getJSON('https://uprvn9yff5.execute-api.us-east-1.amazonaws.com/v1/autocomplete?query=' + textBox.val(), function(data) {
    searchDropdown.empty();
    data.forEach(function(person) {
      if (person.name) {
        var prettyId = prettifyId(person.id);
        var spanElem = $('<span>').attr('person-id', prettyId);
        var liElem = $('<li>');
        if (person.image) {
          liElem.append($('<img>').prop('src', person.image));
        }

        personNames[person.id] = person.name;

        liElem.append($('<hgroup>').append($('<b>').text(person.name)).append($('<p>').text(person.description)));
        liElem.append($('<div>').addClass('status').append($('<div>').addClass('result unknown')));
        spanElem.append(liElem);
        searchDropdown.append(spanElem);
      }
    });
    searchDropdown.addClass('is-open');
    loadStatuses();
    searchDropdown.children('span').on('click', function() {
      window.location.hash = $(this).attr('person-id');
      searchDropdown.removeClass('is-open');
    });
  });
}

function loadStatuses() {
  var ids = searchDropdown.children().map(function() {
    return unPrettifyId($(this).attr('person-id'))
  }).toArray();
  if (ids.length > 0) {
    $.getJSON('https://uprvn9yff5.execute-api.us-east-1.amazonaws.com/v1/query?ids=' + ids.join(','), function(people) {
      console.log(people)
      for (id in people) {
        var person = people[id];
        personCache[id] = person;
        var elem = searchDropdown.find('[person-id="' + prettifyId(id) + '"]');
        if (elem) {
          elem.find('.result').removeClass('unknown').addClass(person.status).show();
        }
      }
    });
  }
}

function prettifyId(id) {
  return id.slice(1).replace('/', ':')
}

function unPrettifyId(id) {
  return '/' + id.replace(':', '/')
}

function formatYear(year) {
  return year < 1000 ? year + ' C.E.' : year;
}
