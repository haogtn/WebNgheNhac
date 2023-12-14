let host = "http://localhost:8080/rest";
const app = angular.module("app", []);

app.controller('ctrl', function ($scope, $http) {

  $scope.form = {}
  $scope.items = []
  $scope.roles = []
  $scope.passwordsMatch = false;
  $scope.validPassword = false;

  $scope.reset = function () {
    $scope.form = {};
    $scope.key = null;
    $scope.isEditing = false;
  }


  $scope.load_all = function () {
    var url = `${host}/authorities`;
    $http.get(url).then(resp => {
      $scope.items = resp.data;
      console.log("Success", resp);

    }).catch(error => {
      console.log("Error", error);
    })
  }

  $scope.load_allroles = function () {
    var url = `${host}/roles`;
    $http.get(url).then(resp => {
      $scope.roles = resp.data;
      console.log("Success", resp);
    }).catch(error => {
      console.log("Error", error);
    });
  };



  $scope.del = function (key) {
    var url = `${host}/authorities/${key}`;
    $http.delete(url).then(
      (resp) => {
        var index = $scope.items.findIndex((item) => item.username == $scope.form.username);
        $scope.items.splice(index, 1);
        $scope.reset();
        $scope.load_all();
        console.log("Success", resp);
      },
      (error) => {
        console.log("Error", error);
      }
    );
  };

  $scope.isEditing = false;

  $scope.edit = function (key) {
    var url = `${host}/authorities/${key}`;
    $http.get(url).then(
      resp => {
        $scope.form = resp.data;
        $scope.isEditing = true; // Bật cờ chỉnh sửa khi nhấn nút edit
        $scope.load_all();
        console.log("Success", resp);
      }
    ).catch(error => {
      console.log("Error", error);
    });
  };


  $scope.isPasswordEditable = function () {
    // Kiểm tra nếu đang chỉnh sửa hoặc form rỗng
    return !$scope.isEditing || Object.keys($scope.form).length === 0;
  };


  $scope.profileData = {}; // Tạo biến mới để lưu trữ thông tin profile

  $scope.getAccount = function () {
    var url = `${host}/authorities/profile`;
    $http.get(url).then(
      resp => {
        $scope.profileData = resp.data; // Gán dữ liệu profile từ API vào biến profileData

        $scope.imagePath = null;

        $scope.imagePath = resp.data.avatarUrl;
        console.log("Success", resp);
      }
    ).catch(error => {
      console.log("Error", error);
    });
  };



  $scope.update = function () {
    var selectedRoleId = $scope.form.accountRole.id;
    console.log('Data to update:', selectedRoleId);
    var item = angular.copy($scope.form);
    var url = `${host}/authorities/${$scope.form.username}`;
    // alert($scope.form.username)
    $http.put(url, item).then(
      (resp) => {
        var index = $scope.items.findIndex((item) => item.username == $scope.form.username);
        $scope.items[index] = resp.data;
        $scope.reset();
        console.log("Success", resp);
      },
      (error) => {
        console.log("Error", error);
      }
    );
  };

  $scope.create = function () {
    $scope.load_all();
    var item = angular.copy($scope.form);
    if ($scope.form.password === $scope.rePassword) {
      var existingUsernameIndex = $scope.items.findIndex((existingItem) => existingItem.email === $scope.form.email);
      if (existingUsernameIndex === -1) {
        var url = `${host}/create/account`;
        $http.post(url, item).then(
          (resp) => {
            $scope.items.push(item);
            console.log($scope.form);
            $scope.reset();
            alert("Success");
            console.log("Success", resp);
          },
          (error) => {
            console.log("Error", error);
          }
        );
      }
      else {
        alert("Email đã tồn tại");
      }
    }
  };

  // $scope.isPasswordValid = function (password) {
  //   return password.length >= 8;
  // };

  // $scope.numberOfPages = function () {
  //   return Math.ceil($scope.items.length / $scope.pageSize);
  // };

  // $scope.getPagesArray = function () {
  //   return new Array($scope.numberOfPages());
  // };


  $scope.search = ''; // Biến để lưu trữ từ khóa tìm kiếm

  $scope.searchUser = function (user) {
    return (
      user.username.toLowerCase().includes($scope.search.toLowerCase()) ||
      user.fullname.toLowerCase().includes($scope.search.toLowerCase()) ||
      user.email.toLowerCase().includes($scope.search.toLowerCase()) ||
      user.accountRole.id.toString().includes($scope.search.toUpperCase())
    );
  };

  $scope.load_all();
  $scope.load_allroles();
  $scope.getAccount();
  $scope.reset();
});
