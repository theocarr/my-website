// On load
$(function() {
  Main.init();
});

// Main sets up the page, initialises js classes, and sets UI listeners
window.Main = new function() {

  // Once Data has initialised it will call start()
  this.init = function() {
    Data.init(start);
  };

  // PRIVATE

  // Bind UI elements and start the home page
  var start = function() {
    Controller.init();
    bindTabButtons();

    homeTabButtonClick();
  }

  var bindTabButtons = function() {
    $('#pie-button').click(pieTabButtonClick);
    $('#chord-button').click(chordTabButtonClick);
    $('#home-button').click(homeTabButtonClick);
  };

  var pieTabButtonClick = function() {
    Controller.displayPie();
    $('.tab-button').removeClass('selected');
    $('#pie-button').addClass('selected');
  };

  var chordTabButtonClick = function() {
    Controller.displayChord();
    $('.tab-button').removeClass('selected');
    $('#chord-button').addClass('selected');
  };

  var homeTabButtonClick = function() {
    Controller.displayAbout();
    $('.tab-button').removeClass('selected');
    $('#home-button').addClass('selected');
  };
};

// Controller handles the loading of new pages within the current  page
window.Controller = new function() {

  var Pages = {
    PIE: 0,
    CHORD: 1,
    ABOUT: 2,
  };

  var currentPage;
  var contentHolder;

  var chordURL = 'views/_chord_view.html';
  var pieURL = 'views/_pie_view.html';
  var homeURL = 'views/_home_view.html';

  this.init = function() {
    contentHolder = $('#partial-content');
    currentPage = -1;
  };

  this.displayPie = function() {
    if (currentPage != Pages.PIE) {
      // load the Pie page
      currentPage = Pages.PIE;
      load(pieURL, PieController);
    }
  };

  this.displayChord = function() {
    if (currentPage != Pages.CHORD) {
      // load the Chord page
      currentPage = Pages.CHORD;
      load(chordURL, ChordController);
    }
  };

  this.displayAbout = function() {
    if (currentPage != Pages.ABOUT) {
      // load the Chord page
      currentPage = Pages.ABOUT;
      load(homeURL, About);
    }
  };

  // PRIVATE

  var load = function(url, visController) {
    contentHolder.load(url, function() {
      // Once loaded, start the D3 content
      visController.init();
    });
  };
};

// Dummy class needed for the controller to work with the about page
window.About = new function() {
  this.init = function() {
  }
}