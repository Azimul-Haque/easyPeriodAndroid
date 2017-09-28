angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,toaster,$ionicModal,$timeout,$http,$rootScope,$ionicPopup,$state,$ionicHistory,$ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  // loads value from the loggedin session
  // Form data for the login modal
  $scope.user = {};

  $scope.successToast = function(title, message){
    toaster.pop('success', title, message);
    // toaster.pop('error', title, message);
    // toaster.pop('warning', title, message);
    //toaster.pop('note', title, message);
  };

  // Create the register modal that we will use later
  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modalReg) {
    $scope.modalReg = modalReg;
  });
  // Triggered in the login modal to close it
  $scope.closeRegister = function() {
    $scope.modalReg.hide();
  };
  // Open the login modal
  $scope.register = function() {
    $scope.modalReg.show();
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
  };

  //logout function
  $scope.logout= function(){
    //delete all the sessions 
    delete sessionStorage.loggedin_name;
    delete sessionStorage.loggedin_id;
    delete sessionStorage.loggedin_email;				
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

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.user);
    str="http://localhost/angular_server1/login.php?email="+$scope.user.email+"&password="+$scope.user.password;
    $http.get(str)
    .success(function (response){   // if login request is Accepted 
      // records is the 'server response array' variable name.
      $scope.user_details = response.records;  // copy response values to user-details object.
      //stores the data in the session. if the user is logged in, then there is no need to show login again.
			sessionStorage.setItem('loggedin_name', $scope.user_details.name);
			sessionStorage.setItem('loggedin_id', $scope.user_details.id );
      sessionStorage.setItem('loggedin_email', $scope.user_details.email);
				
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
      $scope.successToast('SUCCESS', 'Logged in successfully!');
      //$ionicLoading.show({ template: 'Logged in successflly!', noBackdrop: true, duration: 2000 });
    }).error(function(error, status) {  						
      //if login failed
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

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
  };

  $scope.loggedin_name = sessionStorage.getItem('loggedin_name');
  $scope.loggedin_id = sessionStorage.getItem('loggedin_id');
  $scope.loggedin_email = sessionStorage.getItem('loggedin_email');
})

.controller('PeriodListCtrl', function($scope,$http,$rootScope,$ionicHistory,$state,$ionicPopup) {  
  // loads value from the loggedin session
  $scope.loggedin_name= sessionStorage.getItem('loggedin_name');
  $scope.loggedin_id= sessionStorage.getItem('loggedin_id');
  $scope.loggedin_email= sessionStorage.getItem('loggedin_email');

  //logout function
  // $scope.logout= function(){
	// 			//delete all the sessions 
	// 			delete sessionStorage.loggedin_name;
	// 			delete sessionStorage.loggedin_id;
	// 			delete sessionStorage.loggedin_email;				
	// 			// remove the profile page backlink after logout.
	// 			$ionicHistory.nextViewOptions({
	// 				disableAnimate: true,
	// 				disableBack: true
	// 			});
				
	// 			// After logout you will be redirected to the menu page,with no backlink
	// 			$state.go('app.welcome', {}, {location: "replace", reload: true});
	// 	};
    if(!sessionStorage.getItem('loggedin_name')){   
      //if not logged in
      $state.go('app.welcome', {}, {location: "replace", reload: true});
      var alertPopup = $ionicPopup.alert({
        title: 'Error!',
        template: 'Please login first!'
      });
    } else {
      $http.get("http://localhost/angular_server1/customers_sql.php")
      .then(function (response) {$scope.periods = response.data.records;});
    }
    
})

.controller('EntryPeriodCtrl', function($scope, $stateParams) {
})
.controller('PeriodCalendarCtrl', function($scope, $stateParams) {
})
.controller('PlaylistCtrl', function($scope, $stateParams) {
})
.controller('ProfileCtrl', function($scope, $stateParams) {
})
.controller('WelcomeCtrl', function($scope,$rootScope,$ionicHistory,$state) {  
  // loads value from the loggedin session
  $scope.loggedin_name= sessionStorage.getItem('loggedin_name');
  $scope.loggedin_id= sessionStorage.getItem('loggedin_id');
  $scope.loggedin_email= sessionStorage.getItem('loggedin_email');
  if($scope.loggedin_id == null) {
    $rootScope.showLoginReg = true;
  } else {
    $rootScope.showLoginReg = false; 
  }
});