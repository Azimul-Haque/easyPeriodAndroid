// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','toaster', 'ionic-datepicker', 'ionic-material', 'ui.calendar'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.welcome', {
    url: '/welcome',
    views: {
      'menuContent': {
        templateUrl: 'templates/welcome.html',
        controller: 'WelcomeCtrl'
      }
    }
  })
  .state('app.entryperiod', {
    url: '/entryperiod',
    views: {
      'menuContent': {
        templateUrl: 'templates/entryperiod.html',
        controller: 'EntryPeriodCtrl'
      }
    }
  })
  .state('app.periodcalendar', {
    url: '/periodcalendar',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/periodcalendar.html',
        controller: 'PeriodCalendarCtrl'
      }
    }
  })
  .state('app.periodlist', {
    url: '/periodlist',
    views: {
      'menuContent': {
        templateUrl: 'templates/periodlist.html',
        controller: 'PeriodListCtrl'
      }
    }
  })
  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  $urlRouterProvider.otherwise('/app/welcome');

  var datePickerObj = {
      inputDate: new Date(),
      titleLabel: 'Select a Date',
      setLabel: 'Set',
      todayLabel: 'Today',
      closeLabel: 'Close',
      mondayFirst: false,
      weeksList: ["S", "M", "T", "W", "T", "F", "S"],
      monthsList: ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"],
      templateType: 'popup',
      from: new Date(2000, 01, 01),
      to: new Date(2100, 12, 31),
      showTodayButton: true,
      dateFormat: 'dd MMMM yyyy',
      closeOnSelect: true,
      disableWeekdays: []
  };
  ionicDatePickerProvider.configDatePicker(datePickerObj);
});
