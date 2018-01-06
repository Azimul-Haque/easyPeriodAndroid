angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,toaster,$timeout,ionicMaterialInk,ionicMaterialMotion,$ionicModal,$timeout,$http,$rootScope,$ionicPopup,$state,$ionicHistory,$ionicLoading) {

  $scope.loggedin_name = "";
  $timeout(function () {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
    ionicMaterialMotion.fadeSlideInRight();
  }, 300); 
  $scope.user = {};
  $scope.newuser = {};

  $scope.successToast = function(title, message){
    toaster.pop('success', title, message);
    // toaster.pop('error', title, message);
    // toaster.pop('warning', title, message);
    // toaster.pop('note', title, message);
  };

  // Create the register modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modalReg) {
    $scope.modalReg = modalReg;
  });
  // Triggered in the register modal to close it
  $scope.closeRegister = function() {
    $scope.modalReg.hide();
  };
  // Open the register modal
  $scope.register = function() {
    $scope.modalReg.show();
    ionicMaterialInk.displayEffect();
  };


  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modalLogin) {
    $scope.modalLogin = modalLogin;
  });
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modalLogin.hide();
  };
  // Open the login modal
  $scope.login = function() {
    $scope.modalLogin.show();
    ionicMaterialInk.displayEffect();
  };

  //logout function
  $scope.logout= function(){
    //delete all the sessions 
    delete localStorage.loggedin_name;
    delete localStorage.loggedin_id;
    delete localStorage.loggedin_email;				
    delete localStorage.loggedin_created_at;				
    // remove the profile page backlink after logout.
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    
    // After logout you will be redirected to the menu page,with no backlink
    $ionicHistory.clearCache();
    $rootScope.showLoginReg = true; 
    $state.go('app.welcome', {}, {location: "replace", reload: true});
    $scope.successToast('SUCCESS', 'Logged out successfully!');
    //$ionicLoading.show({ template: 'Logged out successflly!', noBackdrop: true, duration: 2000});
  };

  // Perform the register action when the user submits the register form
  $scope.doRegister = function() {
    $ionicLoading.show({ template: '<center><div class="loader"></div><br/>Loading...</center>', noBackdrop: false, delay: 100 });
    str="http://orbachinujbuk.com/ionic_server/register.php?name="+$scope.newuser.name+"&email="+$scope.newuser.email+"&password="+$scope.newuser.password+"&passwordconf="+$scope.newuser.passwordconf;
    $http.get(str)
    .success(function(response){
      //console.log('Done Register', response);
      $scope.responsereg = response.record; //contains Register Result				
			//Shows the respective popup and removes back link
			if($scope.responsereg.created=="1"){

				//no back option
				$ionicHistory.nextViewOptions({
					disableAnimate: true,
					disableBack: true
				});
				// the user is redirected to login page after sign up
        $state.go('app.welcome', {}, {location: "replace", reload: true});
        $scope.closeRegister();
        $ionicLoading.hide();
        $scope.successToast('SUCCESS', 'Registered successfully!');
			}else if($scope.responsereg.exists=="1"){
				$scope.title="User Already exists";
				$scope.template="Please click forgot password if necessary";
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: $scope.title,
          template: $scope.template
        });
		  }else{
				$scope.title="Failed!";
        $scope.template="Contact Our Technical Team";
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: $scope.title,
          template: $scope.template
        });
			}
      
    }).error(function(error, status) {  						
      //if login failed
      $ionicLoading.hide();
      $scope.status = status;
      if(status <= 0) {
        var alertPopup = $ionicPopup.alert({
          title: 'Connection failed!',
          template: 'Please check your internet connection!'
        });
      } else {
        var alertPopup = $ionicPopup.alert({
          title: 'Failed!',
          template: 'Contact Our Technical Team'
        });
      }
    });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    $ionicLoading.show({ template: '<center><div class="loader"></div><br/>Loading...</center>', noBackdrop: false, delay: 100 });
    str="http://orbachinujbuk.com/ionic_server/login.php?email="+$scope.user.email+"&password="+$scope.user.password;
    $http.get(str)
    .success(function (response){   // if login request is Accepted 
      // records is the 'server response array' variable name.
      console.log(str);
      $scope.user_details = response.records;  // copy response values to user-details object.
      //stores the data in the session. if the user is logged in, then there is no need to show login again.
			localStorage.setItem('loggedin_name', $scope.user_details.name);
			localStorage.setItem('loggedin_id', $scope.user_details.id );
      localStorage.setItem('loggedin_email', $scope.user_details.email);
      localStorage.setItem('loggedin_created_at', $scope.user_details.created_at);
				
			// remove the instance of login page, when user moves to profile page.
			// if you dont use it, you can get to login page, even if you are already logged in .
			$ionicHistory.nextViewOptions({
				disableAnimate: true,
				disableBack: true
      });

			//redirect user        
      console.log('Data received', $scope.user_details);
      $rootScope.showLoginReg = false; 
      $state.go('app.welcome', {}, {location: "replace", reload: true});
      $scope.closeLogin();
      $ionicLoading.hide();
      $scope.successToast('SUCCESS', 'Logged in successfully!');
    }).error(function(error, status) {  						
      //if login failed
      $ionicLoading.hide();
      $scope.status = status;
      if(status <= 0) {
        var alertPopup = $ionicPopup.alert({
          title: 'Connection failed!',
          template: 'Please check your internet connection!'
        });
      } else {
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      }
    });
    $scope.loggedin_name = localStorage.getItem('loggedin_name');

    $timeout(function () {
      $scope.loggedin_name = localStorage.getItem('loggedin_name');
      $scope.loggedin_id = localStorage.getItem('loggedin_id');
      $scope.loggedin_email = localStorage.getItem('loggedin_email');
      $scope.loggedin_created_at = localStorage.getItem('loggedin_created_at');
    }, 2000);
  };

  $scope.loggedin_name = localStorage.getItem('loggedin_name');
  $scope.loggedin_id = localStorage.getItem('loggedin_id');
  $scope.loggedin_email = localStorage.getItem('loggedin_email');
  $scope.loggedin_created_at = localStorage.getItem('loggedin_created_at');

  // for the notification
  
  
})


.controller('EntryPeriodCtrl', ['$scope', '$http', '$timeout', '$stateParams', 'ionicDatePicker', '$filter', 'ionicMaterialInk','ionicMaterialMotion','toaster','$ionicHistory','$state', '$cordovaLocalNotification', function($scope, $http, $timeout,$stateParams, ionicDatePicker, $filter,ionicMaterialInk,ionicMaterialMotion, toaster, $ionicHistory,$state,$cordovaLocalNotification) {
  // loads value from the loggedin session
  $scope.loggedin_id= localStorage.getItem('loggedin_id');
  $scope.formSubmission = {};
  $scope.successToast = function(title, message){
    toaster.pop('success', title, message);
    // toaster.pop('error', title, message);
    // toaster.pop('note', title, message);
  };
  $scope.warningToast = function(title, message) {
    toaster.pop('warning', title, message);
  }
  $scope.errorToast = function(title, message){
    toaster.pop('error', title, message);
  };
  $timeout(function () {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
  }, 300);
  var ipObj1 = {
    callback: function (val) {  //Mandatory
      $scope.formSubmission.startDate = $filter('date')(val, "MMMM dd, yyyy"); 
    },
    inputDate: new Date(),      //Optional
    sundayFirst: true,          //Optional
    disableWeekdays: [],       //Optional
    closeOnSelect: true,       //Optional
    templateType: 'popup'       //Optional
  };
  $scope.openDatePicker1 = function(){
    ionicDatePicker.openDatePicker(ipObj1);
  };
  var ipObj2 = {
    callback: function (val) {  //Mandatory
      $scope.formSubmission.endDate = $filter('date')(val, "MMMM dd, yyyy"); 
    },
    inputDate: new Date(),      //Optional
    sundayFirst: true,          //Optional
    disableWeekdays: [],       //Optional
    closeOnSelect: true,       //Optional
    templateType: 'popup'       //Optional
  };
  $scope.openDatePicker2 = function(){
    ionicDatePicker.openDatePicker(ipObj2);
  };
  
  $scope.url = 'http://orbachinujbuk.com/ionic_server/entryperiod.php';
  $scope.formsubmit = function(isValid) {
      if (isValid) {
          $http.post($scope.url, {"user_id": $scope.loggedin_id,"startDate": $scope.formSubmission.startDate, "endDate": $scope.formSubmission.endDate, "description": $scope.formSubmission.description})
                  .success(function(data, status) {
                      $scope.status = status;
                      $scope.result = data.result;
                      console.log($scope.result);
                      //$scope.addNotification(); // local push notification
                      if($scope.result.created == 1) {
                        $scope.successToast('SUCCESS', 'Data entered successfully!');
                      } else {
                        $scope.warningToast('WARNING', 'Already exists! Try another.');
                      }
                      $scope.nmpDateRaw = $scope.formSubmission.startDate;;
                      $scope.nmpDate = new Date($scope.nmpDateRaw).setDate(new Date($scope.nmpDateRaw).getDate() + 28);
                      console.log($filter('date')($scope.nmpDate, "MMMM dd"));
                      $scope.nfsdate = new Date($scope.nmpDateRaw).setDate(new Date($scope.nmpDateRaw).getDate() + 9);
                      $scope.nfedate = new Date($scope.nmpDateRaw).setDate(new Date($scope.nmpDateRaw).getDate() + 15);
                      $state.go('app.welcome', {}, {location: "replace", reload: true});
                      
                  }).error(function(error, status){
                      $scope.status = status;
                      $scope.result = error;
                      console.log($scope.formSubmission.description);
                      console.log($scope.result);
                      console.log($scope.status);
                      $scope.errorToast('ERROR', 'Something is wrong! Try again.');
                  });
      }else{  
            $scope.result = {"error":"Something is wrong! Try again."};
      }
  }
  // UNCOMMENT AFTER THIS COMMENT>>>>>>>>>>>>>>>
  $scope.nmpDateRaw_ntfctn = $scope.formSubmission.startDate;
  $scope.nmpDate_ntfctn = new Date($scope.nmpDateRaw_ntfctn).setDate(new Date($scope.nmpDateRaw_ntfctn).getDate() + 28);
  $scope.nfsdate_ntfctn = new Date($scope.nmpDateRaw_ntfctn).setDate(new Date($scope.nmpDateRaw_ntfctn).getDate() + 9);
  $scope.nfedate_ntfctn = new Date($scope.nmpDateRaw_ntfctn).setDate(new Date($scope.nmpDateRaw_ntfctn).getDate() + 15);

  $scope.nmpDate_ntfctn = $filter('date')($scope.nmpDate_ntfctn, "MMMM dd");
  $scope.nfsdate_ntfctn = $filter('date')($scope.nfsdate_ntfctn, "MMMM dd");
  $scope.nfedate_ntfctn = $filter('date')($scope.nfedate_ntfctn, "MMMM dd");
  $scope.addNotification = function() {
    // further works need to be done...
    var alarmTime = new Date();
    alarmTime.setMinutes(alarmTime.getMinutes() + 1);
    $cordovaLocalNotification.add({
        id: "1234",
        date: alarmTime,
        message: "Next probable period: "+$scope.nmpDate_ntfctn+". Safe zone: "+$scope.nfsdate_ntfctn +"-"+$scope.nfedate_ntfctn,
        title: "EasyPeriod:",
        autoCancel: true,
        sound: null
    }).then(function () {
        //console.log("The notification has been set");
    });
  };
  // if($scope.isScheduled() != true ) {
    
  // }
  // $scope.isScheduled = function() {
  //     $cordovaLocalNotification.isScheduled("1234").then(function(isScheduled) {
  //         return true;
  //     });
  // }
}])
      
.controller('PeriodListCtrl', function($scope,$http,$timeout,$rootScope,$ionicModal,$state,$ionicPopup,ionicMaterialInk,ionicMaterialMotion, $ionicActionSheet,$ionicHistory,toaster) {

  $scope.$on('$ionicView.enter', function(){
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  });
  // loads value from the loggedin session
  $scope.successToast = function(title, message){
    toaster.pop('success', title, message);
  };
  $scope.errorToast = function(title, message){
    toaster.pop('error', title, message);
  };
  $scope.loggedin_id= localStorage.getItem('loggedin_id');

  $scope.showButtons = false;
  $scope.showButtonSettings = function() {
    return $scope.showButtons = !$scope.showButtons;
  }

    if(!localStorage.getItem('loggedin_name')){   
      //if not logged in
      $state.go('app.welcome', {}, {location: "replace", reload: true});
      var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Please login first!'
      });
    } else {
      //$ionicHistory.clearCache();
      $http.get("http://orbachinujbuk.com/ionic_server/getPeriodList.php?id="+$scope.loggedin_id)
      .then(function (response) {
        $scope.periods = response.data;
        console.log($scope.periods);
      },
      function(error) {
        $scope.error = error;
        var alertPopup = $ionicPopup.alert({
          title: 'Error',
          template: $scope.error
        });
      });
    }

    // refresh it
    $scope.doRefresh = function() {
      console.log('Refreshing!');
      $scope.$on('$ionicView.enter', function() {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
      });
      $timeout( function() {
        $ionicHistory.clearCache([$state.current.name]).then(function() {
          $state.reload();
        });
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
    // refresh it

    // Create the edit modal that we will use later
    $ionicModal.fromTemplateUrl('templates/editperiod.html', {
      scope: $scope,
      backdropClickToClose: false
    }).then(function(modalEditPeriod) {
      $scope.modalEditPeriod = modalEditPeriod;
    });
    // Triggered in the edit modal to close it
    $scope.closeEditPeriod = function() {
      $scope.modalEditPeriod.hide();
      $state.go('app.welcome', {}, {location: "replace", reload: true});
    };
    // Open the edit modal
    $scope.editPeriod = function(period) {
      $scope.modalEditPeriod.show();
      $scope.formSubmission = period;
      $timeout(function () {
        ionicMaterialInk.displayEffect();
        ionicMaterialMotion.ripple();
      }, 300);
    };

    // open delete action sheet
    $scope.showDltPrdActnsht = function(period) {
      $ionicActionSheet.show({
        titleText: 'Confirm Delete?',    
        destructiveText: '<i class="icon ion-trash-a"></i> Delete',
        cancelText: '<i class="icon ion-close"></i> Cancel',
        cancel: function() {
          console.log('Canceled!');
        },
        destructiveButtonClicked: function() {
          //console.log('Deleted!');
          $scope.periodToDelete = period;
          console.log($scope.periodToDelete);
          $http.get("http://orbachinujbuk.com/ionic_server/deleteperiod.php?user_id="+$scope.loggedin_id+"&id="+$scope.periodToDelete.id)
          .then(function (response) {
            $scope.deleted = response.data.result;
            console.log($scope.deleted);
            if($scope.deleted.deleted == 1) {
              $scope.successToast('SUCCESS', 'Data deleted successfully!');
            } else {
              $scope.errorToast('ERROR', 'Data could not be deleted!');
            }
            $state.go('app.welcome', {}, {location: "replace", reload: true});
          },
          function(error) {
            $scope.error = error;
            var alertPopup = $ionicPopup.alert({
              title: 'Error',
              template: $scope.error
            });
          });
          return true;
        }
      });
    };

    $timeout(function () {
      // ionicMaterialInk.displayEffect();
      // ionicMaterialMotion.ripple();
      // ionicMaterialMotion.fadeSlideInRight();
    }, 300);
})

.controller('PeriodCalendarCtrl', ['$scope','$http','$stateParams','$ionicPopup', '$timeout','$state','$filter',function($scope, $http, $stateParams,$ionicPopup, $timeout, $state,$filter) {
  // loads value from the loggedin session
  $scope.loggedin_id= localStorage.getItem('loggedin_id');
  $calendar = $('[ui-calendar]');
  var date = new Date(),
  d = date.getDate(),
  m = date.getMonth(),
  y = date.getFullYear();    
  /* config object */
  $scope.uiConfig = {
    calendar: {
      fixedWeekCount: true,
      aspectRatio: 1,
      editable: false,
      selectable: true,
      header: {
      left: 'prev',
      center: 'title',
      right: 'next',
      stick : true,
      },
      eventClick: function(date, jsEvent, view) {
        var alertPopup = $ionicPopup.alert({
          title: $filter('date')(new Date(date.start), "MMMM dd") + '-' + $filter('date')(new Date(date.end), "MMMM dd"),
          template: date.title
        });
      },
      dayClick: $scope.alertEventOnClick,
      eventDrop: $scope.alertOnDrop,
      eventResize: $scope.alertOnResize,
      eventRender: $scope.eventRender
    }
  };
  $scope.events = [];

  $http.get("http://orbachinujbuk.com/ionic_server/getPeriodListForCalender.php?id="+$scope.loggedin_id)
  .then(function (data) {
    //console.log(data);
    $scope.events.slice(0, $scope.events.length);
    angular.forEach(data.data, function(value){
      $scope.events.push({
        title: value.title,
        start: new Date(value.start),
        end: new Date(value.end),
        allDay: false,
        stick: true,
        className: 'Rifat' // fertility color will be changed
      });
    });
  });
  console.log($scope.events);
  $scope.eventSources = [$scope.events];

}])

.controller('EditPeriodCtrl', ['$scope', '$http', '$timeout', '$stateParams', 'ionicDatePicker', '$filter', 'ionicMaterialInk','ionicMaterialMotion','toaster','$ionicHistory', function($scope, $http, $timeout,$stateParams, ionicDatePicker, $filter,ionicMaterialInk,ionicMaterialMotion, toaster, $ionicHistory) {
  // loads value from the loggedin session
  $scope.loggedin_id= localStorage.getItem('loggedin_id');
  //$scope.formSubmission = {};
  $scope.successToast = function(title, message){
    toaster.pop('success', title, message);
  };
  $scope.warningToast = function(title, message) {
    toaster.pop('warning', title, message);
  }
  $scope.errorToast = function(title, message){
    toaster.pop('error', title, message);
  };
  $timeout(function () {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
  }, 300);
  var ipObj3 = {
    callback: function (val) {  //Mandatory
      $scope.formSubmission.start = $filter('date')(val, "MMMM dd, yyyy"); 
    },
    inputDate: new Date(),      //Optional
    sundayFirst: true,          //Optional
    disableWeekdays: [],       //Optional
    closeOnSelect: true,       //Optional
    templateType: 'popup'       //Optional
  };
  $scope.openDatePicker3 = function(){
    ionicDatePicker.openDatePicker(ipObj3);
  };
  var ipObj4 = {
    callback: function (val) {  //Mandatory
      $scope.formSubmission.end = $filter('date')(val, "MMMM dd, yyyy"); 
    },
    inputDate: new Date(),      //Optional
    sundayFirst: true,          //Optional
    disableWeekdays: [],       //Optional
    closeOnSelect: true,       //Optional
    templateType: 'popup'       //Optional
  };
  $scope.openDatePicker4 = function(){
    ionicDatePicker.openDatePicker(ipObj4);
  };
  
  $scope.url = 'http://orbachinujbuk.com/ionic_server/updateperiod.php';
  $scope.formsubmitUpdate = function(isValid) {
      if (isValid) {
          $http.post($scope.url, {"id":$scope.formSubmission.id,"user_id": $scope.loggedin_id,"startDate": $scope.formSubmission.start, "endDate": $scope.formSubmission.end, "description": $scope.formSubmission.title})
                  .success(function(data, status) {
                      console.log($scope.formSubmission.description);
                      console.log(data.result);
                      $scope.status = status;
                      $scope.data = data;
                      $scope.result = data.result; // Show result from server in our <pre></pre> element
                      if($scope.result.updated == 1) {
                        $scope.successToast('SUCCESS', 'Data updated successfully!');
                      } else {
                        $scope.warningToast('WARNING', 'Already exists! Try again.');
                      }
                      //$state.go('app.welcome', {}, {location: "replace", reload: true});
                      $scope.closeEditPeriod();
                      // there will be a redirect from here...
                      
                  }).error(function(error, status){
                      $scope.status = status;
                      $scope.result = error;
                      console.log($scope.formSubmission.description);
                      console.log($scope.result);
                      console.log($scope.status);
                      $scope.errorToast('ERROR', 'Something is wrong! Try again.');
                  });
      }else{  
            $scope.result = {"error":"Something is wrong! Try again."};
      }
  }
}])

.controller('ProfileCtrl', function($scope, $http, $stateParams, ionicMaterialInk,ionicMaterialMotion, $timeout) {
  $timeout(function () {
    ionicMaterialInk.displayEffect();
    ionicMaterialMotion.ripple();
    ionicMaterialMotion.fadeSlideInRight();
  }, 300);
  $scope.loggedin_name = localStorage.getItem('loggedin_name');
  $scope.loggedin_id = localStorage.getItem('loggedin_id');
  $scope.loggedin_email = localStorage.getItem('loggedin_email');
  $scope.loggedin_created_at = localStorage.getItem('loggedin_created_at');
 
  $http.get("http://orbachinujbuk.com/ionic_server/getPeriodList.php?id="+$scope.loggedin_id)
  .then(function (response) {
    $scope.periods = response.data;
    console.log($scope.periods);
  },
  function(error) {
    $scope.error = error;
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: $scope.error
    });
  });
})


.controller('WelcomeCtrl', function($scope,$http,$timeout,$rootScope,$ionicHistory,$state, ionicMaterialInk,ionicMaterialMotion,$filter) {
  $scope.$on('$ionicView.enter', function(){
    $ionicHistory.clearCache();
    $ionicHistory.clearHistory();
  });
  $timeout(function () {
    ionicMaterialInk.displayEffect();
    //ionicMaterialMotion.ripple();
    //ionicMaterialMotion.fadeSlideInRight();
  }, 300); 
  // loads value from the loggedin session
  $scope.loggedin_name= localStorage.getItem('loggedin_name');
  $scope.loggedin_id= localStorage.getItem('loggedin_id');
  $scope.loggedin_email= localStorage.getItem('loggedin_email');
  if($scope.loggedin_id == null) {
    $rootScope.showLoginReg = true;
    $rootScope.showHomePageItems = false;
  } else {
    $rootScope.showLoginReg = false; 
    $rootScope.showHomePageItems = true; 
  }

  // for the notification
  $http.get("http://orbachinujbuk.com/ionic_server/getPeriodList.php?id="+$scope.loggedin_id)
  .then(function (response) {
    $scope.periods = response.data;
    console.log($scope.periods);
    $scope.nmpDateRaw = $scope.periods[0].start;
    $scope.nmpDate = new Date($scope.nmpDateRaw).setDate(new Date($scope.nmpDateRaw).getDate() + 28);
    console.log($filter('date')($scope.nmpDate, "MMMM dd"));
    $scope.nfsdate = new Date($scope.nmpDateRaw).setDate(new Date($scope.nmpDateRaw).getDate() + 9);
    $scope.nfedate = new Date($scope.nmpDateRaw).setDate(new Date($scope.nmpDateRaw).getDate() + 15);
  },
  function(error) {
    $scope.error = error;
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: $scope.error
    });
  });
});