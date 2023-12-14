let host = "http://localhost:8080/rest";
var app = angular.module('songApp', []);
app.controller('songCtrl', function ($scope, $http, $sce) {

    $scope.form = {}
    $scope.items = []
    $scope.genres = []
    $scope.chooseGenres = []
    $scope.genreEdit = []
    $scope.singers = []
    $scope.tableSinger = []
    $scope.album = []
    $scope.albumTitle = "";
    $scope.albumID = null;
    $scope.reset = function () {

        $scope.form = {
            genres: [] // Khởi tạo mảng genres trong form khi reset
        };
        $scope.key = null;
        $scope.chooseGenres = []
        $scope.load_all();
        $scope.load_album();
        $scope.load_singer();
        $scope.load_genres();
        $scope.albumTitle = ``;
        $scope.tableSinger = [];
        $scope.imagePath = ``;
        $scope.trustedSoundUrl = ``;

    }



    $scope.load_all = function () {
        var url = `${host}/song`;
        $http.get(url).then(resp => {
            $scope.items = resp.data;
            console.log("Success", resp);

        }).catch(error => {
            console.log("Error", error);
        })

    }

    $scope.load_genres = function () {
        var url = `${host}/genres`;
        $http.get(url).then(resp => {
            $scope.genres = resp.data;
            console.log("Load genres Success", resp);
        }).catch(error => {
            console.log("Load genres ERROR!", error);
        })
    }

    $scope.load_singer = function () {
        var url = `${host}/singer`;
        $http.get(url).then(resp => {
            $scope.singers = resp.data;
            console.log("Load singer Success", resp);
        }).catch(error => {
            console.log("Load singer ERROR!", error);
        })
    }

    $scope.load_album = function () {
        var url = `${host}/albums`;
        $http.get(url).then(resp => {
            $scope.album = resp.data;
            console.log("Load album Success", resp);
        }).catch(error => {
            console.log("Load album ERROR!", error);
        })
    }

    //Đẩy dữ liệu vào singerAlbum khi chọn option
    $scope.chooseSinger = function (selectedSinger) {

        var url = `${host}/singer/${selectedSinger}`;
        if (selectedSinger) {
            $http.get(url).then(resp => {
                $scope.tableSinger.push(resp.data);
                var index = $scope.singers.findIndex(singer => singer.id === selectedSinger);
                if (index !== -1) {
                    $scope.singers.splice(index, 1);
                }
                console.log("ChooseSinger Succcess", resp);

            }).catch(error => {
                console.log("ChooseSinger Error", error);
            })


        }
    }

    $scope.chooseAlbum = function (albumId, albumTitle) {

        var url = `${host}/singerAlbum/singer/${albumId}`;

        $http.get(url).then(resp => {
            $scope.singers = []
            $scope.singers = resp.data;
            $scope.albumID = albumId;
            $scope.albumTitle = albumTitle;

            console.log("set Singer by id Succcess", resp.data);

        }).catch(error => {
            console.log("set Singer by id Error", error);
        })



    }

    $scope.removeSingerTable = function (id) {
        var url = `${host}/singer/${id}`;
        var index = $scope.tableSinger.findIndex(item => item.id == id);
        $scope.tableSinger.splice(index, 1);
        $http.get(url).then(resp => {
            $scope.singers.push(resp.data);
            console.log("ChooseSinger Succcess", resp);

        }).catch(error => {
            console.log("Error", error);
        })
    }

    $scope.addGenres = function (genre) {

        if ($scope.chooseGenres.indexOf(genre) === -1) {
            $scope.chooseGenres.push(genre);
        } else {
            var index = $scope.chooseGenres.indexOf(genre);
            $scope.chooseGenres.splice(index, 1);
        }
    }




    //~~~~~~~~~~~~~~~~~~~~~~~~~Create~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $scope.create = function () {
        var url = `${host}/song`;

        var formData = new FormData();

        formData.append('name', $scope.form.name);
        formData.append('album', $scope.albumID);
        formData.append('img', $scope.fileImg);
        formData.append('path', $scope.fileSound);

        var formImg = new FormData();
        formImg.append('file', document.getElementById('fileImg').files[0]);

        var formMp3 = new FormData();
        formMp3.append('fileAudio', document.getElementById('fileSound').files[0]);

        //---------Thêm ảnh vào máy chủ--------------------------
        var fileImg = document.getElementById('fileImg');
        if (fileImg.files.length > 0) {
            var urlImg = `${host}/song/img`;
            $http.post(urlImg, formImg, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(resp => {
                console.log("Successfully added an image to the system", resp.data)

            }).catch(error => {
                console.log("error added an image to the system", error)
            })
        }

        //---------End thêm ảnh vào máy chủ--------------------------

        //---------Thêm mp3 vào máy chủ------------------------------
        var fileSound = document.getElementById('fileSound');
        if (fileSound.files.length > 0) {
            var urlSong = `${host}/song/sound`;
            $http.post(urlSong, formMp3, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(resp => {
                console.log("Successfully added an sound to the system", resp.data)

            }).catch(error => {
                console.log("error added an sound to the system", error)
            })
        }
        //---------End Thêm mp3 vào máy chủ------------------------------
        //------------Thêm Song------------------------------------------
        $http.post(url, formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(
            function (response) {

                //---------------Thêm Genres cho Song-------------------------
                var urlSongGenrs = `${host}/songGenres`;
                var formSongGenres = new FormData();
                formSongGenres.append("song", response.data.id)
                for (var i = 0; i < $scope.chooseGenres.length; i++) {
                    formSongGenres.append("genres", $scope.chooseGenres[i]);

                }
                $http.post(urlSongGenrs, formSongGenres, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).then(resp => {
                    console.log("Add SongGenres Success!", resp.data);
                }).catch(error => {
                    console.log("Add SongGenres Error!", error);
                })



                //---------------End thêm Genres cho Song---------------------

                //----------------Thêm Singer cho song------------------------
                var urlSongSinger = `${host}/songSinger`;
                var formSongSinger = new FormData();
                formSongSinger.append("song", response.data.id)
                for (var i = 0; i < $scope.tableSinger.length; i++) {
                    formSongSinger.append("singers", $scope.tableSinger[i].id);

                }
                $http.post(urlSongSinger, formSongSinger, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).then(resp => {
                    console.log("Add SongSigner Success!", resp.data);
                }).catch(error => {
                    console.log("Add SongSigner Error!", error);
                })
                //---------------End thêm Singer cho song---------------------
                $scope.items.push(response.data);
                $scope.reset();
                alert("Success");
                console.log("Add song success!", response.data);
            },
            function (error) {
                // Xử lý khi có lỗi
                alert("Error");
                console.log("Add song error!", error);
            }
        );
        //------------End Thêm Song------------------------------------------
    };


    //~~~~~~~~~~~~~~~~~~~~~~~Edit~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    $scope.edit = function (key) {
        var urlSong = `${host}/song/${key}`;
        var urlSinger = `${host}/songSinger/singer/${key}`;
        var urlGenres = `${host}/songGenres/genres/${key}`;
        $http.get(urlSong).then(resp => {
            $scope.form = resp.data;
            $scope.fileImg = resp.data.image;
            $scope.form.imagePath = `/asset/img/song/${resp.data.image}`;
            $scope.fileSound = resp.data.path;
            $scope.trustedSoundUrl = `/asset/audio/${resp.data.path}`;
            $scope.albumTitle = resp.data.album.title;
            $scope.albumID = resp.data.album.id;
            console.log("Fill in the data in the form successfully", resp.data);
        }).catch(error => {
            console.log("Filling in data on the form has an error", error)
        })

        //Lấy dữ liệu Singer 
        $http.get(urlSinger).then(respSinger => {
            $scope.tableSinger = respSinger.data;
            console.log("Success", respSinger.data);
            for (let i = $scope.singers.length - 1; i >= 0; i--) {

                let singer = $scope.singers[i];
                if ($scope.tableSinger.some(album => album.id == singer.id)) {
                    $scope.singers.splice(i, 1);
                }
            }


        }).catch(errorSinger => {
            console.log("Error", errorSinger);
        });

        //Lấy dữ liệu genres
        $http.get(urlGenres).then(respGenres => {

            $scope.genreEdit = respGenres.data;
            $scope.chooseGenres = []

            for (let i = $scope.genres.length - 1; i >= 0; i--) {

                let genre = $scope.genres[i];

                if ($scope.genreEdit.some(g => g.id == genre.id)) {
                    genre.isChecked = genre.name;
                    $scope.chooseGenres.push(genre.id)

                } else {
                    genre.isChecked = false;
                }
                // let genre = $scope.genres[i];

                // // Check if the current genre's id is present in $scope.genreEdit
                // let isGenreInEdit = $scope.genreEdit.some(g => g.id === genre.id);

                // // Set the isChecked property of the current genre based on the result
                // genre.isChecked = genre;
            }

        }).catch(errorSinger => {
            console.log("Error", errorSinger);
        });
    }


    $scope.update = function () {
        var url = `${host}/song/update`;

        var formData = new FormData();
        formData.append("id", $scope.form.id);
        formData.append('name', $scope.form.name);
        formData.append('album', $scope.albumID);
        formData.append('img', $scope.fileImg);
        formData.append('path', $scope.fileSound);

        var formImg = new FormData();
        formImg.append('file', document.getElementById('fileImg').files[0]);

        var formMp3 = new FormData();
        formMp3.append('fileAudio', document.getElementById('fileSound').files[0]);

        //---------Thêm ảnh vào máy chủ--------------------------
        var fileImg = document.getElementById('fileImg');
        if (fileImg.files.length > 0) {
            var urlImg = `${host}/song/img`;
            $http.post(urlImg, formImg, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(resp => {
                console.log("Successfully added an image to the system", resp.data)

            }).catch(error => {
                console.log("error added an image to the system", error)
            })
        }
        //---------End thêm ảnh vào máy chủ--------------------------

        //---------Thêm mp3 vào máy chủ------------------------------
        var fileSound = document.getElementById('fileSound');
        if (fileSound.files.length > 0) {
            var urlSong = `${host}/song/sound`;
            $http.post(urlSong, formMp3, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(resp => {
                console.log("Successfully added an sound to the system", resp.data)

            }).catch(error => {
                console.log("error added an sound to the system", error)
            })
        }
        //---------End Thêm mp3 vào máy chủ------------------------------
        //------------update Song------------------------------------------

        $http.put(url, formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).then(resp => {


            //------------------UPDATE GENRES----------------------------
            var formGenres = new FormData();
            formGenres.append("songId", $scope.form.id);
            for (var i = 0; i < $scope.chooseGenres.length; i++) {
                formGenres.append("genresId", $scope.chooseGenres[i]);

            }
            var urlSongGenres = `${host}/songGenres/update`;
            $http.post(urlSongGenres, formGenres, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(resp => {
                $scope.reset();
                console.log("Successfully update genres to the system", resp.data)
            }).catch(error => {
                console.log("ERROR update genres to the system", error)
            })

            //----------------END UPDATE GENRES----------------------------

            //------------------UPDATE SINGER----------------------------
            var formSinger = new FormData();
            formSinger.append("songId", $scope.form.id);
            for (var i = 0; i < $scope.tableSinger.length; i++) {
                formSinger.append("singerId", $scope.tableSinger[i].id);

            }
            var urlSongSinger = `${host}/songSinger/update`;
            $http.post(urlSongSinger, formSinger, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            }).then(resp => {
                $scope.reset();
                console.log("Successfully update singer to the system", resp.data)
            }).catch(error => {
                console.log("ERROR update singer to the system", error)
            })

            //----------------END UPDATE SINGER----------------------------



            console.log("Update succesful!", resp.data);
        }).catch(error => {
            console.log("Update Error", error);
        });



    }

    //--------------------------------------------

    $scope.delete = function (id) {
        var delSong = `${host}/song/delete/${id}`;
        var delSongSinger = `${host}/songSinger/delete/${id}`;
        var delSongGenres = `${host}/songGenres/delete/${id}`;
        $http.delete(delSongGenres).then(resp => {
            console.log("Del Song Genres Successfull");
            $http.delete(delSongSinger).then(resp => {
                console.log("Del Song Singer Successfull");
                $http.delete(delSong).then(resp => {
                    var index = $scope.items.findIndex(item => item.id == id);
                    $scope.items.splice(index, 1);
                    $scope.reset();
                    console.log("Del Song Successfull");

                }).catch(error => {
                    console.log("ERROR del song", error)
                })
                
            }).catch(error => {
                alert.log("Delete album ERROR", error)
            })
        }).catch(error => {
            console.log("Del SingeAlbum Error");
        });


    }






    $scope.load_all();
    $scope.load_genres();
    $scope.load_singer();
    $scope.updateImagePreview = function () {
        var fileInput = document.getElementById('fileImg');
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

    document.getElementById('fileImg').addEventListener('change', function (event) {
        console.log('Change event triggered.');
        $scope.updateImagePreview();

        // Nếu có mã chặn sự kiện change, bạn có thể thấy thông báo sau trong Console.
        console.log('Event:', event);
    });


    $scope.updateSoundPreview = function () {
        var fileInput = document.getElementById('fileSound');
        if (fileInput.files.length > 0) {
            var fileName = fileInput.files[0].name;
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.soundPath = e.target.result;
                    $scope.fileSound = fileName;
                    $scope.trustedSoundUrl = $sce.trustAsResourceUrl(e.target.result);
                    console.log($scope.trustedSoundUrl)

                });
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {

        }
    };

    document.getElementById('fileSound').addEventListener('change', function (event) {
        console.log('Change event triggered for sound file.');
        $scope.updateSoundPreview();

        console.log('Event:', event);
    });

    $scope.load_all();
    $scope.load_album();

});