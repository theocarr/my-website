// ChordController handles the interface between the page, the Data class, and the Chord D3 class
window.ChordController = new function() {
  var gameType;
  var teamsType;

  // Set the listeners and initialise the Chord with some data
  this.init = function() {
    setupControlls();

    var years = $('#years input');
    $(years[years.length - 1]).attr('checked','checked');

    $('#games-both').addClass('selected');
    gameType = null;
    $('#teams-all').addClass('selected');
    teamsType = null;

    var data = updateData();
    Chord.init(data);
  };

  var setupControlls = function() {
    var yearTable = $('#years tbody');
    var years = Data.getYears();
    var line;

    for (i in years) {
      if (i % 2 == 0) {
        line = $('<tr>');
        $(yearTable).append(line);
      }
      var cell = $('<td>');
      $("<input />", {id: 'yr' + i, type: 'checkbox', value: years[i]})
        .change(updateChord)
        .appendTo($(cell));
      $("<label />", {'for': 'yr' + i, text: years[i]}).appendTo($(cell));
      $(line).append(cell);
    }

    $('#games-non-final').click(nonFinalClick);
    $('#games-final').click(finalClick);
    $('#games-both').click(bothClick);

    $('#teams-nz').click(nzClick);
    $('#teams-au').click(auClick);
    $('#teams-int').click(intClick);
    $('#teams-all').click(allClick);
  };

  var nzClick = function() {
    $('.teams-button').removeClass('selected');
    $('#teams-nz').addClass('selected');
    teamsType = 'NZ-only';

    updateChord();
  };

  var auClick = function() {
    $('.teams-button').removeClass('selected');
    $('#teams-au').addClass('selected');
    teamsType = 'AU-only';

    updateChord();
  };

  var intClick = function() {
    $('.teams-button').removeClass('selected');
    $('#teams-int').addClass('selected');
    teamsType = 'international-only';

    updateChord();
  };

  var allClick = function() {
    $('.teams-button').removeClass('selected');
    $('#teams-all').addClass('selected');
    teamsType = null;

    updateChord();
  };

  var nonFinalClick = function() {
    $('.games-button').removeClass('selected');
    $('#games-non-final').addClass('selected');
    gameType = 'non-finals';

    updateChord();
  };

  var finalClick = function() {
    $('.games-button').removeClass('selected');
    $('#games-final').addClass('selected');
    gameType = 'finals';

    updateChord();
  };

  var bothClick = function() {
    $('.games-button').removeClass('selected');
    $('#games-both').addClass('selected');
    gameType = null;

    updateChord();
  };

  var updateChord = function() {
    $('#chord-diagram').html('')
    var data = updateData();
    Chord.update(data);

    if (data.length == 0) {
      $('#chord-diagram').html('<h2>No Games</h2>')
    }
  };

  var updateData = function() {
    var years = [];
    var options = [];

    $('#years :checkbox:checked').each(function(i, year){
      years.push($(year).val());
    });

    if (gameType != null) {
      options.push(gameType);
    }

    if (teamsType != null) {
      options.push(teamsType);
    }


    return Data.chordData(years, options);
  };
};