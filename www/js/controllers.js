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
  $scope.newuser = {};

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
  // Triggered in the register modal to close it
  $scope.closeRegister = function() {
    $scope.modalReg.hide();
  };
  // Open the register modal
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

  // Perform the register action when the user submits the register form
  $scope.doRegister = function() {
    $ionicLoading.show({ template: '<center><div class="loader"></div><br/>Loading...</center>', noBackdrop: false, delay: 100 });
    str="http://localhost/angular_server1/register.php?name="+$scope.newuser.name+"&email="+$scope.newuser.email+"&password="+$scope.newuser.password+"&passwordconf="+$scope.newuser.passwordconf;
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

.controller('EntryPeriodCtrl', function($scope, $stateParams, ionicDatePicker, $filter) {
  var ipObj1 = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.startDate = $filter('date')(val, "MMMM dd, yyyy"); 
    },
    inputDate: new Date(),      //Optional
    sundayFirst: true,          //Optional
    disableWeekdays: [0],       //Optional
    closeOnSelect: true,       //Optional
    templateType: 'popup'       //Optional
  };
  $scope.openDatePicker1 = function(){
    ionicDatePicker.openDatePicker(ipObj1);
  };

  var ipObj2 = {
    callback: function (val) {  //Mandatory
      console.log('Return value from the datepicker popup is : ' + val, new Date(val));
      $scope.endDate = $filter('date')(val, "MMMM dd, yyyy"); 
    },
    inputDate: new Date(),      //Optional
    sundayFirst: true,          //Optional
    disableWeekdays: [0],       //Optional
    closeOnSelect: true,       //Optional
    templateType: 'popup',       //Optional
    dateFormat: 'dd MMMM yyyy'
  };
  $scope.openDatePicker2 = function(){
    ionicDatePicker.openDatePicker(ipObj2);
  };

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