// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var database = "easyperiod.db";
var db = null;
var easyperiod = angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers','toaster', 'ionic-datepicker', 'ionic-material', 'ui.calendar']);

easyperiod.run(function($ionicPlatform, $cordovaSQLite, $rootScope, $state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    // onesignal code
    // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});
    
    var notificationOpenedCallback = function(jsonData) {
      console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    };
    cordova.plugins.autoStart.enable();
    window.plugins.OneSignal
    .startInit("68616824-4bac-4630-be22-5c4a0bc9a8f8")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit();

    // window.plugins.OneSignal.idsAvailable((idsAvailable) => {
    //     $rootScope.player_id = idsAvailable.playerId;
    // });
    // onesignal code

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    // window.plugin.notification.local.onadd = function (id, state, json) {
    //   var notification = {
    //       id: id,
    //       state: state,
    //       json: json
    //   };
    //   $timeout(function() {
    //       $rootScope.$broadcast("$cordovaLocalNotification:added", notification);
    //   });
    // };
    db = window.openDatabase(database, '1.0', 'sqlitedemo', 2000);
    $cordovaSQLite.execute(db, "CREATE TABLE periods(id integer primary key, user_id integer, start text unique, end text, description text, email text, uniquekey text unique, created_at text, updated_at text)");              
  });


  // Override the android back button
  $ionicPlatform.registerBackButtonAction(function () {
    if ($state.current.name == "app.welcome") {
      navigator.app.exitApp();
    } else {
      $state.go("app.welcome");
    }
  }, 100);

})

.config(function($stateProvider, $urlRouterProvider, ionicDatePickerProvider, $ionicConfigProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.welcome', {
    url: '/welcome',
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/welcome.html',
        controller: 'WelcomeCtrl'
      }
    }
  })
  .state('app.entryperiod', {
    url: '/entryperiod',
    cache: false,
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
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'templates/periodlist.html',
        controller: 'PeriodListCtrl'
      }
    }
  })
  // .state('app.editperiod', {
  //   url: '/editperiod',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/editperiod.html',
  //       controller: 'EditPeriodCtrl'
  //     }
  //   }
  // })
  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })
  .state('app.about', {
    url: '/about',
    views: {
      'menuContent': {
        templateUrl: 'templates/about.html',
        controller: 'AboutCtrl'
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

  $ionicConfigProvider.views.swipeBackEnabled(true);
});
