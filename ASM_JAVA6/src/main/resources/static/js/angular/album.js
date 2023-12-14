
let host = "http://localhost:8080/rest";

const app = angular.module("albumApp", []);

app.controller('albumCtrl', function ($scope, $http) {

    $scope.form = {}
    $scope.items = []
    $scope.singers = []
    $scope.singersAlbum = []
    $scope.selectedSinger = null;

    $scope.reset = function () {

        $scope.form = {};
        $scope.key = null;
        $scope.releaseYear = null
        // $scope.form.imagePath = `/asset/img/album/`;
        $scope.form.imagePath = null;
        $scope.fileImg = null;
        $scope.errors = null;
        console.log("fileImg after reset:", $scope.imagePath);


    }


    //Edit
    $scope.edit = function (key) {
        var url = `${host}/albums/${key}`;
        var urlSinger = `${host}/singerAlbum/singer/${key}`;
        $http.get(url).then(resp => {
            $scope.form = resp.data;
            $scope.fileImg = resp.data.image;


            $scope.form.imagePath = `/asset/img/album/${resp.data.image}`;
            $scope.form.id = key
            $scope.key = key;
            $scope.errors = null;
            console.log("Success", resp);
        }).catch(error => {
            console.log("Error", error);
        });

        //Lấy dữ liệu Singer
        $http.get(urlSinger).then(respSinger => {
            $scope.singersAlbum = respSinger.data;
            console.log("Success", respSinger.data);
            for (let i = $scope.singers.length - 1; i >= 0; i--) {

                let singer = $scope.singers[i];
                if ($scope.singersAlbum.some(album => album.id == singer.id)) {
                    $scope.singers.splice(i, 1);
                }
            }


        }).catch(errorSinger => {
            console.log("Error", errorSinger);
        });


    };



    //Load dữ liệu lên table
    $scope.load_all = function () {

        var url = `${host}/albums`;
        $http.get(url).then(resp => {
            $scope.items = resp.data;
            console.log("Success", resp);

        }).catch(error => {
            console.log("Error", error);
        })
    }

    //load  dữ liệu singer vào select
    $scope.load_singer = function () {

        var url = `${host}/singer`;
        $http.get(url).then(resp => {
            $scope.singers = resp.data;
            console.log("Success", resp);

        }).catch(error => {
            console.log("Error", error);
        })

    }

    // //tạo mới album
    // $scope.create = function () {
    //     var url = `${host}/albums`;

    //     var formData = new FormData();
    //     formData.append('file', document.getElementById('file').files[0]);
    //     formData.append('title', $scope.form.title);
    //     formData.append('releaseYear', $scope.form.releaseYear);

    //     $http.post(url, formData, {
    //         transformRequest: angular.identity,
    //         headers: {
    //             'Content-Type': undefined
    //         }
    //     }).then(function (response) {
    //         var albumId = response.data.id;

    //         // Vòng lặp thêm SingerAlbum
    //         angular.forEach($scope.singersAlbum, function (singer) {
    //             var formSingerAlbum = new FormData();
    //             formSingerAlbum.append('albumId', albumId);
    //             formSingerAlbum.append('singerId', singer.id);

    //             $http.post(`${host}/singerAlbum`, formSingerAlbum, {
    //                 transformRequest: angular.identity,
    //                 headers: {
    //                     'Content-Type': undefined
    //                 }
    //             }).then(function (singerAlbumResponse) {
    //                 console.log("Add Album-Singer Success", singerAlbumResponse)
    //             }).catch(function (singerAlbumError) {
    //                 console.error('Error adding SingerAlbum:', singerAlbumError);
    //             });
    //         });
    //         $scope.items.push(response.data);
    //         $scope.reset();
    //         console.log('Upload success:', response.data);
    //     }).catch(function (error) {
    //         console.error('Error:', error);
    //     });
    // };

    //tạo mới album
    $scope.create = function () {
        var url = `${host}/albums`;
        var formImg = new FormData();
        var formData = new FormData();

        formData.append('file', $scope.fileImg);
        formData.append('title', $scope.form.title);
        formData.append('releaseYear', $scope.form.releaseYear);
        formImg.append('file', document.getElementById('fileInput').files[0])


        //Thêm file ảnh vào máy chủ
        var fileInput = document.getElementById('fileInput');
        if (fileInput.files.length > 0) {
            var urlImg = `${host}/albums/img`;
            $http.post(urlImg, formImg, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(resp => {
                console.log("Successfully added an image to the system")
            }).catch(error => {
                console.log("error added an image to the system")
            });

        };


        //Thêm album vào máy chủ
        var album = {
            title: $scope.form.title,
            releaseYear: $scope.form.releaseYear,
            image: $scope.fileImg
        };
        $http.post(url, album).then(function (response) {
            var albumId = response.data.id;
            // Vòng lặp thêm SingerAlbum
            if ($scope.singersAlbum.length <= 0) {
                $scope.errorsAlbum = "Please select an album";
            } else {
                angular.forEach($scope.singersAlbum, function (singer) {
                    var formSingerAlbum = new FormData();
                    formSingerAlbum.append('albumId', albumId);
                    formSingerAlbum.append('singerId', singer.id);

                    $http.post(`${host}/singerAlbum`, formSingerAlbum, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }).then(function (singerAlbumResponse) {
                        console.log("Add Album-Singer Success", singerAlbumResponse)
                    }).catch(function (singerAlbumError) {
                        console.log('Error adding SingerAlbum:', singerAlbumError);
                    });
                });
            }

            $scope.items.push(response.data);
            $scope.reset();
            $scope.errors = null;
            console.log('Upload success:', response.data);
        }).catch(function (error) {
            console.log('Error:', error);
            $scope.errors = error.data;
        });
        //--------------------------------------------



    };


    $scope.update = function () {

        var formAlbum = new FormData();
        formAlbum.append('file', $scope.fileImg);
        formAlbum.append('title', $scope.form.title);
        formAlbum.append('releaseYear', $scope.form.releaseYear);
        var formImg = new FormData();
        formImg.append('file', document.getElementById('fileInput').files[0])
        //url rest
        var url = `${host}/albums/${$scope.form.id}`;
        var urlFindAllSingerInAlbum = `${host}/singerAlbum/singer/${$scope.form.id}`;
        var urlImg = `${host}/albums/img`;
        //thêm ảnh vào hệ thông
        var fileInput = document.getElementById('fileInput');
        if (fileInput.files.length > 0) {
            //gọi api thêm ảnh vào hệ thống
            $http.post(urlImg, formImg, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(resp => {
                console.log("Successfully added an image to the system")

            }).catch(error => {
                console.log("error added an image to the system")
            })
        }

        //Gọi Api update album
        var album = {
            title: $scope.form.title,
            releaseYear: $scope.form.releaseYear,
            image: $scope.fileImg
        };
        $http.put(url, album).then(resp => {
            $scope.items.push(resp.data);
            $scope.reset();
            $scope.load_all();
            console.log('Upload success:', resp.data);
            $scope.errors = null;
        }).catch(error => {
            $scope.errors = error.data;
            console.log("wut Error", error)
        });


        // Update SingerAlbum
        $http.get(urlFindAllSingerInAlbum).then(respSinger => {
            var singersFromDatabase = respSinger.data;


            // Thêm các singer mới vào danh sách album
            var singersToAdd = $scope.singersAlbum.filter(sa => {
                return !singersFromDatabase.some(sd => sd.id === sa.id);
            });

            if ($scope.singersAlbum.length <= 0) {
                $scope.errorsAlbum = "Please select an album";
            } else {
                // Xóa các singer không có trong danh sách mới
                var singersToDelete = singersFromDatabase.filter(dbSinger => {

                    return !$scope.singersAlbum.some(sa => sa.id === dbSinger.id);
                });
                console.log('Singers to delete:', singersToDelete);

                singersToDelete.forEach(singerToDelete => {

                    var deleteUrl = `${host}/singerAlbum/${$scope.form.id}/${singerToDelete.id}`;
                    $http.delete(deleteUrl).then(response => {

                        console.log("Successfully deleted singer from album:", response.data);
                    }).catch(error => {
                        console.log('Error deleting singer from SingerAlbum:', error);
                    });
                });

                singersToAdd.forEach(singerToAdd => {

                    var addUrl = `${host}/singerAlbum`;

                    var formSingerAlbum = new FormData();
                    formSingerAlbum.append('albumId', $scope.form.id);
                    formSingerAlbum.append('singerId', singerToAdd.id);

                    $http.post(addUrl, formSingerAlbum, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }).then(response => {
                        console.log("Successfully added singer to SingerAlbum:", response.data);
                    }).catch(error => {
                        console.log('Error adding singer to SingerAlbum:', error);
                    });
                });

            }


        })


    }




    //Đẩy dữ liệu vào singerAlbum khi chọn option
    $scope.chooseSinger = function (selectedSinger) {

        var url = `${host}/singer/${selectedSinger}`;
        if (selectedSinger) {
            $http.get(url).then(resp => {
                $scope.singersAlbum.push(resp.data);
                var index = $scope.singers.findIndex(singer => singer.id === selectedSinger);
                if (index !== -1) {
                    $scope.singers.splice(index, 1);
                }
                console.log("ChooseSinger Succcess", resp);

            }).catch(error => {
                console.log("Error", error);
            })


        }
    }

    $scope.removeSingerAlbum = function (id) {
        var url = `${host}/singer/${id}`;
        var index = $scope.singersAlbum.findIndex(item => item.id == id);
        $scope.singersAlbum.splice(index, 1);
        $http.get(url).then(resp => {
            $scope.singers.push(resp.data);
            console.log("ChooseSinger Succcess", resp);

        }).catch(error => {
            console.log("Error", error);
        })
    }


    $scope.delete = function (id) {
        var delAlbumUrl = `${host}/albums/${id}`;
        var delSingAlbumUrl = `${host}/singerAlbum/delAll/${id}`;
        $http.delete(delSingAlbumUrl).then(resp => {
            console.log("Del SingeAlbum Successfull");
            $http.delete(delAlbumUrl).then(resp => {
                var index = $scope.items.findIndex(item => item.id == id);
                $scope.items.splice(index, 1);
                $scope.reset();
                alert("Delete album successful!")
            }).catch(error => {

                alert.log("Delete album ERROR", error)
            })
        }).catch(error => {
            console.log("Del SingeAlbum Error");
        });


    }


    $scope.load_singer();
    $scope.reset();
    $scope.updateImagePreview = function () {
        var fileInput = document.getElementById('fileInput');
        if (fileInput.files.length > 0) {
            var fileName = fileInput.files[0].name;
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.form.imagePath = e.target.result;
                    $scope.fileImg = fileName;
                });
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // Nếu không có tệp nào được chọn, bạn có thể xử lý theo ý của mình ở đây.
        }

    };

    document.getElementById('fileInput').addEventListener('change', function (event) {
        console.log('Change event triggered.');
        $scope.updateImagePreview();

        // Nếu có mã chặn sự kiện change, bạn có thể thấy thông báo sau trong Console.
        console.log('Event:', event);
    });
    $scope.load_all();
});
