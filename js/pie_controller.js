// PieController handles the interface between the page (HTML), the Data class, and the Pie D3 class
window.PieController = new function() {

  // Set up UI listeners, and initialise the Pie with some data
  this.init = function() {
    setupControlls();

    var years = $('#years input');
    $(years[years.length - 1]).attr('checked','checked');

    var data = updateData();
    var data2 = updateCompareData();
    Pie.init(data, data2);
  };

  this.getSelectedTeam = function() {
    return $('#team').val();
  }

  this.getComparedTeam = function() {
    return $('#team2').val();
  }

  var setupControlls = function() {
    var teamElement = $('#team');
    var team2Element = $('#team2');
    var yearTable = $('#years tbody');
    var teams = Data.getTeamNames();
    var years = Data.getYears();
    var line;

    for (i in years) {
      if (i % 2 == 0) {
        line = $('<tr>');
        $(yearTable).append(line);
      }
      var cell = $('<td>');
      $("<input />", {id: 'yr' + i, type: 'checkbox', value: years[i]})
        .change(updatePie)
        .appendTo($(cell));
      $("<label />", {'for': 'yr' + i, text: years[i]}).appendTo($(cell));
      $(line).append(cell);
    }

    for (i in teams) {
      $("<option>", {value: teams[i], text: teams[i]})
        .appendTo(teamElement);
      $("<option>", {value: teams[i], text: teams[i]})
        .appendTo(team2Element);
    }
    $(teamElement).change(updatePie);
    $(team2Element).change(updateCompare);
  };

  var updatePie = function() {
    var data = updateData();

    if (hasYears()) {
      Pie.update(data);
      updateCompare();
    }
  };

  var updateCompare = function() {
    var data = updateCompareData();

    if (hasYears()) {
      Pie.updateCompare(data);
    }
  };

  var hasYears = function() {
    return $('#years :checkbox:checked').length
  }

  var updateData = function() {
    var team = $('#team').val();
    var years = [];

    $('#years :checkbox:checked').each(function(i, year){
      years.push($(year).val());
    });

    return Data.pieData(team, years);
  };

  var updateCompareData = function() {
    var team = $('#team2').val();
    var years = [];

    $('#years :checkbox:checked').each(function(i, year){
      years.push($(year).val());
    });

    return Data.pieData(team, years);
  };
};