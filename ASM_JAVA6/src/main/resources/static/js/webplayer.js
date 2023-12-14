let left_scroll = document.getElementById("left_scroll");
let right_scroll = document.getElementById("right_scroll");

let pop_song = document.getElementsByClassName("pop_song")[0];
if (left_scroll) {
  left_scroll.addEventListener("click", () => {
    console.log("hey");
    pop_song.scrollLeft -= 416;
  });
}
if (right_scroll) {
  right_scroll.addEventListener("click", () => {
    pop_song.scrollLeft += 416;
  });
}

let host = "http://localhost:8080/rest";
var app = angular
  .module("webplayerApp", [])
  .controller("webplayerCtrl", function ($scope, $http, $interval, $location) {
    //tat ca album trong database
    $scope.fullalbum;
    $scope.song_play;
    //tat ca bai hat trong database
    $scope.fullsongs;
    $scope.currentSongIndex = 0; // Index của bài hát hiện tại trong danh sách songs

    $scope.find_songinfo = function () {
      var url = `${host}/songsinfo/`;
      $http
        .get(url)
        .then((resp) => {
          $scope.fullsongs = resp.data;
          // Duyệt qua mỗi bài hát và xác định thời lượng
          $scope.fullsongs.forEach(function (song) {
            var audio = new Audio();
            audio.src = song.song.path; // Đường dẫn đến tệp MP3
            audio.addEventListener("loadedmetadata", function () {
              // Thêm thuộc tính duration vào đối tượng song
              song.song.duration = $scope.formatTime(audio.duration);
              $scope.$apply(); // Cập nhật view Angular
            });
          });

          console.log("song_info Success", $scope.fullsongs);
        })
        .catch((error) => {
          console.log("song_info Error", error);
        });
    };

    // Hàm để định dạng thời gian từ giây sang mm:ss
    $scope.formatTime = function (time) {
      var minutes = Math.floor(time / 60);
      var seconds = Math.floor(time % 60);
      return (
        (minutes < 10 ? "0" : "") +
        minutes +
        ":" +
        (seconds < 10 ? "0" : "") +
        seconds
      );
    };
    $scope.find_songinfo();

    $scope.getAccount = function () {
      var urluser = `${host}/authorities/profile`;

      $http
        .get(urluser)
        .then((resp) => {
          $scope.userLogged = resp.data; // Gán dữ liệu profile từ API vào biến profileData
          console.log("user ok " + $scope.userLogged.fullname);
          var urlfavbyuser = `${host}/fav/${$scope.userLogged.username}`;
          $http
            .get(urlfavbyuser)
            .then((resp) => {
              $scope.favByUser = resp.data;
              $scope.fullsongs.forEach(function (song) {
                song.song.isFav = $scope.favByUser.some(
                  (favSong) => favSong.song.id === song.song.id
                );
              });
              console.log(urlfavbyuser);
              console.log("song fav by user ok 1 ", $scope.favByUser);
            })
            .catch((error) => {
              $scope.favByUser = null;
              console.log("song fav by user err 2 ", error);
            });
        })
        .catch((error) => {
          $scope.userLogged = null;
          console.log("user error", error);
        });
    };
    $scope.getAccount();
    $scope.favorite = function (song) {
      if ($scope.userLogged == null) {
        alert("Please log in to use this feature");
        return;
      }
      if (song.isFav) {
        var url = `${host}/fav/del/${song.id}/${$scope.userLogged.username}`;
        $http
          .delete(url)
          .then((resp) => {
            song.isFav = false;
            console.log("del fav success", resp);
          })
          .catch((error) => {
            console.log("del fav error", error);
          });
      } else {
        var url = `${host}/fav/add/${song.id}/${$scope.userLogged.username}`;
        $http
          .post(url)
          .then((resp) => {
            song.isFav = true;
            console.log("add fav success", resp);
          })
          .catch((error) => {
            console.log("add fav error", error);
          });
      }
    };

    $scope.findSongById = function (songId, callback) {
      var url = `${host}/song/${songId}`;
      $http
        .get(url)
        .then((resp) => {
          $scope.song_play = resp.data;
          // console.log("song_play Success", $scope.song_play);
          if (callback && typeof callback === "function") {
            callback(); // Execute the callback after fetching the song details
          }
        })
        .catch((error) => {
          // console.log("song_play Error", error);
        });
    };

    var sound;
    $scope.isPlaying = false;

    $scope.chooseSong = function (songId) {
      if (sound) {
        //kiểm tra sound có tồn tại không
        //nếu tồn tại thì dừng sound trước đó
        sound.pause();
        //set sound về null
        sound = null;
      }

      // console.log("SONG ID ====> " + id);
      $scope.findSongById(songId, function () {
        // console.log("Selected song: " + $scope.song_play.name);
        $scope.title = $scope.song_play.name;

        var songRow = document.getElementById($scope.song_play.id);
        // Lấy thẻ <td> thứ ba trong thẻ <tr>
        var artistNameTd = songRow.getElementsByTagName("td")[2];
        // Lấy nội dung từ thẻ <td>
        var artistName = artistNameTd.textContent;
        alert(artistName);
        // Gán nội dung vào phần tử có id 'artist-name'
        document.getElementById("artist-name").textContent = artistName;

        $scope.song_image_bar = $scope.song_play.image;
        //sau khi tìm sound theo id thì thực hiện playMusic()
        $scope.playMusic();
      });
    };

    // $scope.playMusic = function () {
    //   if (!sound) {
    //     sound = new Howl({
    //       // src: ["/asset/audio/IF ANDOR WHEN Ruel.mp3"],
    //       src: [`${$scope.song_play.path}`],
    //       format: ["mp3"],
    //       onplay: function () {
    //         $scope.isPlaying = true; // Đặt trạng thái là đang chạy khi nhạc được play
    //         $scope.$apply();
    //       },
    //       onpause: function () {
    //         $scope.isPlaying = false; // Đặt trạng thái là đã tạm dừng khi nhạc được pause
    //         $scope.$apply();
    //       },
    //       onstop: function () {
    //         $scope.isPlaying = false; // Đặt trạng thái là đã tạm dừng khi nhạc được stop
    //         $scope.$apply();
    //       },
    //       onend: function () {
    //         $scope.isPlaying = false;
    //         $scope.$apply();
    //       },
    //     });
    //   }

    //   if ($scope.isPlaying) {
    //     audioPlayIcon.innerHTML = playIcon;
    //     sound.pause(); // Nếu đang chạy, tạm dừng
    //   } else {
    //     audioPlayIcon.innerHTML = playIconSVG;
    //     sound.play(); // Nếu không chạy, play nhạc
    //   }
    // };

    // $scope.pauseMusic = function () {
    //   sound.pause();
    //   $scope.isPlaying = false; // Đặt trạng thái là đã tạm dừng khi nhạc được pause
    // };

    // $scope.stopMusic = function () {
    //   sound.stop();
    //   $scope.isPlaying = false; // Đặt trạng thái là đã tạm dừng khi nhạc được stop
    // };

    // $scope.currentTime = "0:00"; // Thời gian hiện tại
    // $scope.duration = "0:00"; // Thời gian phát của bài hát

    // $scope.formatTime = function (time) {
    //   var minutes = Math.floor(time / 60);
    //   var seconds = Math.floor(time % 60);
    //   return (
    //     (minutes < 10 ? "0" : "") +
    //     minutes +
    //     ":" +
    //     (seconds < 10 ? "0" : "") +
    //     seconds
    //   );
    // };

    // $scope.updateSeek = function () {
    //   // Kiểm tra xem có đối tượng (sound) có tồn tại không
    //   if (sound) {
    //     var newPosition = ($scope.seekValue / 100) * sound.duration();
    //     sound.seek(newPosition);
    //     $scope.currentTime = $scope.formatTime(sound.seek());
    //   } else {
    //     $scope.seek(0);
    //   }
    // };

    // $interval(function () {
    //   if (sound && $scope.isPlaying) {
    //     $scope.currentTime = $scope.formatTime(sound.seek());
    //     $scope.duration = $scope.formatTime(sound.duration());
    //     $scope.seekValue = (sound.seek() / sound.duration()) * 100;

    //     var bar2 = document.getElementById("bar2");
    //     var dot = document.getElementsByClassName("dot")[0];
    //     bar2.style.width = $scope.seekValue + "%";
    //     dot.style.left = $scope.seekValue + "%";
    //     //var music_curr = sound.seek();
    //     //var music_dur = sound.duration();

    //     //$scope.seekValue = (music_curr / music_dur) * 100;
    //     //console.log("CURRENT TIME ++ " + $scope.currentTime);
    //     // console.log("current TIME ++ " + sound.seek());
    //     //$scope.seekValue = (music_curr / music_dur) * 100;
    //     if (
    //       $scope.currentTime === $scope.duration ||
    //       sound.seek() === sound.duration() ||
    //       sound.onend
    //     ) {
    //       $scope.playNextSong();
    //     }
    //   }
    // }, 1000);

    // $scope.volume = 0.3;
    // $scope.volBarWidth = "0%";
    // $scope.volDotLeft = "0%";
    // $scope.volBarWidth = $scope.volume * 100 + "%";
    // $scope.volDotLeft = $scope.volume * 100 + "%";
    // $scope.updateVolume = function () {
    //   if (sound) {
    //     sound.volume($scope.volume);

    //     // Cập nhật thanh âm lượng
    //     $scope.volBarWidth = $scope.volume * 100 + "%";
    //     $scope.volDotLeft = $scope.volume * 100 + "%";
    //   }
    // };
  });
