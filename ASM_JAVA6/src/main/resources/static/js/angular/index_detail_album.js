let host = "http://localhost:8080/rest";

var app = angular.module("indexApp", []);
app.controller("indexCtrl", function ($scope, $http) {
  $scope.albums = [];
  $scope.singers = [];
  $scope.findSingerByAlbum = [];
  //-----------------------------------------------------------------------------
  //Lưu số lượt người truy cập trang web
  var IPurl = 'https://httpbin.org/ip';

  // Sử dụng $http để gửi GET request để lấy địa chỉ IP
  $http.get(IPurl)
      .then(function(response) {
          // Lấy địa chỉ IP từ response.data.origin
          var userIpAddress = response.data.origin;
         
          // Gửi POST request đến API của bạn với địa chỉ IP
         var ip = new FormData();
         ip.append("ipAddress", userIpAddress);
          $http.post('/api/access-log', ip,{
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        })
              .then(function(response) {
                  console.log("Add access log success!", response.data);
              })
              .catch(function(error) {
                  // Xử lý lỗi nếu cần
                  console.log("Error when add access log", error);
              });
      })
      .catch(function(error) {
          // Xử lý lỗi nếu cần
      });
    //End lưu số lượt người truy cập vào trang web  
    //-----------------------------------------------------------------------------

  //Load dữ liệu albums
  $scope.load_all_album = function () {
    var url = `${host}/albums`;
    $http
      .get(url)
      .then((resp) => {
        $scope.albums = resp.data;
        console.log("albums Success", resp);
      })
      .catch((error) => {
        console.log("albums Error", error);
      });
  };
  //Load dữ liệu singer
  $scope.load_all_singer = function () {
    var url = `${host}/singer`;
    $http
      .get(url)
      .then((resp) => {
        $scope.singers = resp.data;
        console.log("singers Success", resp);
      })
      .catch((error) => {
        console.log("singers Error", error);
      });
  };
  //Load dữ liệu singer_album
  $scope.find_SingerByAlbum = function (albumId) {
    var url = `${host}/singerAlbum/singer/${albumId}`;
    $http
      .get(url)
      .then((resp) => {
        $scope.findSingerByAlbum = resp.data;
        console.log("albums_singers Success", resp);
        return resp.data;
      })
      .catch((error) => {
        console.log("albums_singers Error", error);
      });
  };


  

  $scope.playAlbum = function () {};
  $scope.load_all_album();
  $scope.load_all_singer();
});
