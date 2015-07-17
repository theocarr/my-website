// Data loads in the data files, and handles data filtering and manipulation
window.Data = new function() {

  var FINALS = 15;

  // To add new years data, just add a new line to files object below (need to be in same format!!)
  // EXPECTED FORMAT : Round, Date, Home Team, Score, Away Team, Venue
  // eg 1,Saturday 5 April,Central Pulse,33-50,Melbourne Vixens,"TSB Bank Arena, Wellington"
  // LINES WITH BYES SHOULD BE REMOVED FROM THE DATA FILE
  var files = {
    2008: 'data/2008.csv',
    2009: 'data/2009.csv',
    2010: 'data/2010.csv',
    2011: 'data/2011.csv',
    2012: 'data/2012.csv',
    2013: 'data/2013.csv',
  };

  var teams = {
    'Adelaide Thunderbirds': {
      country: 'AU',
      color: '#DBA0B7',
      colorComplement: '#EA3478',
      logo: 'img/logo/thunderbirds.png',
    },
    'Central Pulse': {
      country: 'NZ',
      color: '#F9D800',
      colorComplement: '#0081CE',
      logo: 'img/logo/pulse.png',
    },
    'Canterbury Tactix': {
      country: 'NZ',
      color: '#000',
      colorComplement: '#E90014',
      logo: 'img/logo/tactix.png',
    },
    'Melbourne Vixens': {
      country: 'AU',
      color: '#139870',
      colorComplement: '#CB0025',
      logo: 'img/logo/vixens.png',
    },
    'New South Wales Swifts': {
      country: 'AU',
      color: '#DB0008',
      colorComplement: '#0D6CC2',
      logo: 'img/logo/swifts.png',
    },
    'Northern Mystics': {
      country: 'NZ',
      color: '#3879C0',
      colorComplement: '#EB0010',
      logo: 'img/logo/nothernmystics.png',
    },
    'Queensland Firebirds': {
      country: 'AU',
      color: '#EB5E2B',
      colorComplement: '#B72679',
      logo: 'img/logo/firebirds.png',
    },
    'Southern Steel': {
      country: 'NZ',
      color: '#BB0057',
      colorComplement: '#F8A113',
      logo: 'img/logo/southernsteel.png',
    },
    'Waikato Bay of Plenty Magic': {
      country: 'NZ',
      color: '#050060',
      colorComplement: '#EA0016',
      logo: 'img/logo/magic.png',
    },
    'West Coast Fever': {
      country: 'AU',
      color: '#CAE0B2',
      colorComplement: '#EA1239',
      logo: 'img/logo/west_coast_fever.png',
    },
  };

  var filterFunctions = {};

  var MatchType = {
    NZ: 0,
    AU: 1,
    INT: 2,
  }

  var data = {};

  var startMainCallback;

  // Set callback and load in the data
  this.init = function(callback) {
    startMainCallback = callback;

    filterFunctions = {
      'finals': sortFinals,
      'non-finals': sortNonFinals,
      'NZ-only': sortNZOnly,
      'AU-only': sortAUOnly,
      'international-only': sortInternationalOnly,
    }

    loadData();
  };

  // Get the raw data for a year
  this.getDataForYear = function(year) {
    return data[year];
  };

  // Get the years of data we have loaded
  this.getYears = function() {
    return Object.keys(files);
  }

  // Returns the hash of teams
  this.getTeams = function() {
    return teams;
  }

  // Gets an array with all the team names in it
  this.getTeamNames = function() {
    return Object.keys(teams);
  }

  // Generate data for the Chord diagram
  this.chordData = function(years, options) {
    var formattedData = {};
    var dataArray = [];
    var sortedData = getDataForYears(years);

    // call filter functions on the data
    for (i in options) {
      sortedData = filterFunctions[options[i]](sortedData);
    }

    // set up initial data format
    for (var team in teams) {
      formattedData[team] = {};
    }

    // add games to the data
    for (i in sortedData) {
      var match = sortedData[i];
      var team1 = match["Home Team"];
      var team2 = match["Away Team"];

      // retrieve scores
      var score = match.Score.replace('draw', '');
      score = score.replace(' ', '');
      var team1Score = parseInt(score.split('-')[0]);
      var team2Score = parseInt(score.split('-')[1]);

      if (formattedData[team1][team2] == null){
        formattedData[team1][team2] = team1Score;
      } else {
        formattedData[team1][team2] += team1Score;
      }

      if (formattedData[team2][team1] == null){
        formattedData[team2][team1] = team2Score;
      } else {
        formattedData[team2][team1] += team2Score;
      }
    }

    // set up final data formatted for the Chord class
    for (var team in formattedData) {
      for (var opponent in formattedData[team]) {
        dataArray.push({'team': team, 'opponent': opponent, 'score': formattedData[team][opponent]});
      }
    }

    return dataArray;
  };

  // Generate data for the Pie chart
  this.pieData = function(team, years) {
    var yearData = getDataForYears(years);
    var homeWin = {
      type: "Home Match: Win",
      count: 0,
    };
    var homeLoss = {
      type: "Home Match: Loss",
      count: 0,
    };
    var awayWin = {
      type: "Away Match: Win",
      count: 0,
    };
    var awayLoss = {
      type: "Away Match: Loss",
      count: 0,
    };

    for (i in yearData) {
      var match = yearData[i];
      var score = match.Score.split('-');

      if (match.Score.indexOf("draw") > -1) {
        // override for draws. (This means a draw counts as a win for both teams)
        score = [1,1];
      }

      if (team == match["Home Team"]) {
        if (parseInt(score[0]) >= parseInt(score[1])) {
          homeWin.count++;
        } else {
          homeLoss.count++;
        }
      } else if (team == match["Away Team"]) {
        if (parseInt(score[1]) >= parseInt(score[0])) {
          awayWin.count++;
        } else {
          awayLoss.count++;
        }
      }
    }

    return [awayWin, awayLoss, homeLoss, homeWin];
  };

  // PRIVATE

  var sortFinals = function(sortedData) {
    var optionSortedData = [];

    for (i in sortedData) {
      var match = sortedData[i];
      if (parseInt(match.Round) >= FINALS) {
        optionSortedData.push(match);
      }
    }
    return optionSortedData;
  };

  var sortNonFinals = function(sortedData) {
    var optionSortedData = [];

    for (i in sortedData) {
      var match = sortedData[i];
      if (parseInt(match.Round) < FINALS) {
        optionSortedData.push(match);
      }
    }
    return optionSortedData;
  };

  var sortNZOnly = function(sortedData) {
    var optionSortedData = [];

    for (i in sortedData) {
      var match = sortedData[i];

      if (matchType(match["Home Team"], match["Away Team"]) == MatchType.NZ) {
        optionSortedData.push(match);
      }
    }

    return optionSortedData;
  };

  var sortAUOnly = function(sortedData) {
    var optionSortedData = [];

    for (i in sortedData) {
      var match = sortedData[i];

      if (matchType(match["Home Team"], match["Away Team"]) == MatchType.AU) {
        optionSortedData.push(match);
      }
    }

    return optionSortedData;
  };

  var sortInternationalOnly = function(sortedData) {
    var optionSortedData = [];

    for (i in sortedData) {
      var match = sortedData[i];

      if (matchType(match["Home Team"], match["Away Team"]) == MatchType.INT) {
        optionSortedData.push(match);
      }
    }

    return optionSortedData;
  };

  var matchType = function(team1, team2){
    var loc1 = teams[team1].country;
    var loc2 = teams[team2].country;

    if (loc1 != loc2) {
      return MatchType.INT;
    } else if (loc1 == 'NZ') {
      return MatchType.NZ;
    } else {
      return MatchType.AU;
    }
  }

  var getDataForYears = function(years) {
    var foundData = [];

    for (yearNum in years) {
      foundData = foundData.concat(data[years[yearNum]]);
    }

    return foundData;
  };

  // If all the data is loaded the callback will be called here
  var completeLoad = function() {
    if (Object.keys(data).length >= Object.keys(files).length) {
      startMainCallback();
    }
  };

  var loadData = function() {
    for (var year in files) {
      load(year);
    };
  };

  var load = function(year) {
    d3.csv(files[year], function(csv) {
      data[year] = csv;
      completeLoad();
    });
  };
};
