//khai báo angular js
//angular.module('myApp', []);

let host = "http://localhost:8080/rest";
var app = angular
  .module("detailalbumapp", [])
  .controller(
    "detailalbumctrl",
    function ($scope, $http, $interval, $location) {
      var currentURL = $location.absUrl();
      var start = "http://localhost:8080/album/detai/".length;
      var album_id = currentURL.substring(start);

      //hiển thị popup tìm kiểm album
      $scope.showSuggestions = false;

      $scope.album;
      $scope.song_play;
      //tat ca bai hat trong album
      $scope.songs;
      $scope.currentSongIndex = 0; // Index của bài hát hiện tại trong danh sách songs
      $scope.checkSP;

      $scope.findFullAlbum = function () {
        var url = `${host}/albums`;
        $http
          .get(url)
          .then((resp) => {
            $scope.album = resp.data;
            console.log("full album Success", $scope.album);
          })
          .catch((error) => {
            console.log("full album Error", error);
          });
      };
      $scope.findFullAlbum();

      $scope.playAll = function () {
        if (sound) {
          //kiểm tra sound có tồn tại không
          //nếu tồn tại thì dừng sound trước đó
          sound.pause();
          //set sound về null
          sound = null;
        }
        // $scope.song_play = $scope.songs[0];
        $scope.song_play = $scope.filteredSongs[0].song;
        console.log("AAA" + $scope.song_play);
        $scope.chooseSong($scope.song_play.id);
        // $scope.playMusic();
      };

      var playIcon = `<i class="fa-solid fa-play"></i>Play`;
      var playIconSVG = `<div class="listening">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 76 26">
    <defs><style>.wave{fill:#231f20;}</style></defs>
    <g id="audio-wave" data-name="audio-wave">
      <rect id="wave-5" class="wave" x="32" y="7" width="4" height="12" rx="2" ry="2"/>
      <rect id="wave-4" class="wave" x="24" y="2" width="4" height="22" rx="2" ry="2"/>
      <rect id="wave-3" class="wave" x="16" width="4" height="26" rx="2" ry="2"/>
      <rect id="wave-2" class="wave" x="8" y="5" width="4" height="16" rx="2" ry="2"/>
      <rect id="wave-1" class="wave" y="9" width="4" height="8" rx="2" ry="2"/>
      <rect id="wave-5-2" data-name="wave-4" class="wave" x="72" y="7" width="4" height="12" rx="2" ry="2"/>
      <rect id="wave-4-2" data-name="wave-5" class="wave" x="64" y="2" width="4" height="22" rx="2" ry="2"/>
      <rect id="wave-3-2" data-name="wave-3" class="wave" x="56" width="4" height="26" rx="2" ry="2"/>
      <rect id="wave-2-2" data-name="wave-2" class="wave" x="48" y="5" width="4" height="16" rx="2" ry="2"/>
      <rect id="wave-1-2" data-name="wave-1" class="wave" x="40" y="9" width="4" height="8" rx="2" ry="2"/>
    </g>
  </svg>
</div>`;
      var addButton = `<button
style="width: 100%;"
type="button"
name="" ng-click="addSongToPlaylist(playlist)">ADD</button>`;
      var audioPlayIcon = document.getElementById("audioWave");
      // Hàm để xác định thời lượng và cập nhật mảng $scope.songs
      $scope.find_songinfo = function (album_id) {
        var url = `${host}/songsinfo/${album_id}`;
        $http
          .get(url)
          .then((resp) => {
            $scope.songs = resp.data;
            audioPlayIcon.innerHTML = playIcon;
            // Duyệt qua mỗi bài hát và xác định thời lượng
            $scope.songs.forEach(function (song) {
              var audio = new Audio();
              audio.src = song.song.path; // Đường dẫn đến tệp MP3
              audio.addEventListener("loadedmetadata", function () {
                // Thêm thuộc tính duration vào đối tượng song
                song.song.duration = $scope.formatTime(audio.duration);
                $scope.$apply(); // Cập nhật view Angular
              });
            });

            $scope.filteredSongs = $scope.songs;

            console.log("song_info Success", $scope.songs);
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

      $scope.find_songinfo(album_id);

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
          // Gán nội dung vào phần tử có id 'artist-name'
          document.getElementById("artist-name").textContent = artistName;
          $scope.song_image_bar = $scope.song_play.image;
          //sau khi tìm sound theo id thì thực hiện playMusic()
          $scope.playMusic();
        });
      };

      //play music
      $scope.playMusic = function () {
        if (!sound) {
          sound = new Howl({
            // src: ["/asset/audio/IF ANDOR WHEN Ruel.mp3"],
            src: [`${$scope.song_play.path}`],
            format: ["mp3"],
            onplay: function () {
              $scope.isPlaying = true; // Đặt trạng thái là đang chạy khi nhạc được play
              $scope.$apply();
            },
            onpause: function () {
              $scope.isPlaying = false; // Đặt trạng thái là đã tạm dừng khi nhạc được pause
              $scope.$apply();
            },
            onstop: function () {
              $scope.isPlaying = false; // Đặt trạng thái là đã tạm dừng khi nhạc được stop
              $scope.$apply();
            },
            onend: function () {
              $scope.isPlaying = false;
              $scope.$apply();
            },
          });
        }

        if ($scope.isPlaying) {
          audioPlayIcon.innerHTML = playIcon;
          sound.pause(); // Nếu đang chạy, tạm dừng
        } else {
          audioPlayIcon.innerHTML = playIconSVG;
          sound.play(); // Nếu không chạy, play nhạc
        }
      };

      $scope.pauseMusic = function () {
        sound.pause();
        $scope.isPlaying = false; // Đặt trạng thái là đã tạm dừng khi nhạc được pause
      };

      $scope.stopMusic = function () {
        sound.stop();
        $scope.isPlaying = false; // Đặt trạng thái là đã tạm dừng khi nhạc được stop
      };

      $scope.currentTime = "0:00"; // Thời gian hiện tại
      $scope.duration = "0:00"; // Thời gian phát của bài hát

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

      $scope.updateSeek = function () {
        // Kiểm tra xem có đối tượng (sound) có tồn tại không
        if (sound) {
          var newPosition = ($scope.seekValue / 100) * sound.duration();
          sound.seek(newPosition);
          $scope.currentTime = $scope.formatTime(sound.seek());
        } else {
          $scope.seek(0);
        }
      };

      $interval(function () {
        if (sound && $scope.isPlaying) {
          $scope.currentTime = $scope.formatTime(sound.seek());
          $scope.duration = $scope.formatTime(sound.duration());
          $scope.seekValue = (sound.seek() / sound.duration()) * 100;

          var bar2 = document.getElementById("bar2");
          var dot = document.getElementsByClassName("dot")[0];
          bar2.style.width = $scope.seekValue + "%";
          dot.style.left = $scope.seekValue + "%";
          //var music_curr = sound.seek();
          //var music_dur = sound.duration();

          //$scope.seekValue = (music_curr / music_dur) * 100;
          //console.log("CURRENT TIME ++ " + $scope.currentTime);
          // console.log("current TIME ++ " + sound.seek());
          //$scope.seekValue = (music_curr / music_dur) * 100;
          if (
            $scope.currentTime === $scope.duration ||
            sound.seek() === sound.duration() ||
            sound.onend
          ) {
            $scope.playNextSong();
          }
        }
      }, 1000);

      $scope.volume = 0.3;
      $scope.volBarWidth = "0%";
      $scope.volDotLeft = "0%";
      $scope.volBarWidth = $scope.volume * 100 + "%";
      $scope.volDotLeft = $scope.volume * 100 + "%";
      $scope.updateVolume = function () {
        if (sound) {
          sound.volume($scope.volume);

          // Cập nhật thanh âm lượng
          $scope.volBarWidth = $scope.volume * 100 + "%";
          $scope.volDotLeft = $scope.volume * 100 + "%";
        }
      };

      //tự động phát bài đầu tiên trong danh sách
      window.onload = function () {
        $scope.getAccount();
        // $scope.chooseSong($scope.filteredSongs[0].song.id);
      };

      $scope.shuffleSongs = function () {
        for (let i = $scope.filteredSongs.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = $scope.filteredSongs[i];
          $scope.filteredSongs[i] = $scope.filteredSongs[j];
          $scope.filteredSongs[j] = temp;
        }

        $scope.currentSongIndex = $scope.filteredSongs.indexOf(
          $scope.song_play
        );
      };

      $scope.playNextSong = function () {
        $scope.currentSongIndex++;
        if ($scope.currentSongIndex >= $scope.filteredSongs.length) {
          $scope.currentSongIndex = 0; // Quay lại bài đầu tiên nếu đã ở cuối danh sách
        }
        console.log(
          "SONG NEXT " + $scope.filteredSongs[$scope.currentSongIndex].song.name
        );
        $scope.loadSongByIndex($scope.currentSongIndex);
      };

      $scope.playPreviousSong = function () {
        $scope.currentSongIndex--;
        if ($scope.currentSongIndex < 0) {
          $scope.currentSongIndex = $scope.filteredSongs.length - 1; // Quay lại bài cuối cùng nếu đã ở đầu danh sách
        }
        console.log(
          "SONG PREV " + $scope.filteredSongs[$scope.currentSongIndex].song.name
        );
        $scope.loadSongByIndex($scope.currentSongIndex);
      };

      $scope.loadSongByIndex = function (index) {
        console.log("SELCTED SONg " + $scope.filteredSongs[index].song.id);
        var selectedSong = document.getElementById(
          $scope.filteredSongs[index].song.id
        );
        $scope.chooseSong($scope.filteredSongs[index].song.id);
        selectedSong.click(); // Kích hoạt sự kiện click trên dòng tương ứng trong danh sách bài hát
      };

      $scope.filterSongs = function () {
        // Logic lọc tùy chỉnh dựa trên searchKeyword
        $scope.filteredSongs = $scope.songs.filter(function (song) {
          // Kiểm tra xem tiêu đề, nghệ sĩ hoặc thể loại của bài hát có chứa searchKeyword không
          return (
            song.song.name
              .toLowerCase()
              .includes($scope.searchKeyword.toLowerCase()) ||
            // Thêm các kiểm tra tương tự cho nghệ sĩ và thể loại
            song.singers.some((singer) =>
              singer.name
                .toLowerCase()
                .includes($scope.searchKeyword.toLowerCase())
            ) ||
            song.genres.some((genre) =>
              genre.name
                .toLowerCase()
                .includes($scope.searchKeyword.toLowerCase())
            )
          );
        });
      };

      // kiểm tra đăng nhập
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
                $scope.songs.forEach(function (song) {
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

      /*PLAYLIST*/
      $scope.song_id;
      $scope.playlistAddOn = function (songId) {
        console.log("SONG ID WHEN CLICK ADD TO PLAYLIST +++ " + songId);
        // $scope.song_id = songId;
        $scope.song_play = songId;
        // $scope.getAccount();
        // $scope.getSongPlaylistByPlaylistId("2");
        $scope.tablePlaylistShow();
        $scope.findSongById($scope.song_id);
      };

      $scope.getPlaylistById = function (playlistId) {
        for (var i = 0; i < $scope.playlistData.length; i++) {
          if ($scope.playlistData[i].id === playlistId) {
            // Nếu tìm thấy playlist có id mong muốn, trả về nó
            return $scope.playlistData[i];
          }
        }
        // Nếu không tìm thấy playlist, trả về null hoặc thực hiện một hành động khác tùy thuộc vào yêu cầu của bạn
        return null;
      };

      $scope.tablePlaylistShow = function () {
        $scope.getAccount();

        // Create a reference to tbody
        var tbody = angular.element(document.getElementById("playlistshow"));
      };

      $scope.findSongInPlaylist = function (playlist, song) {};

      $scope.addSongToPlaylist = function (playlist) {
        // $scope.getSongPlaylistByPlaylistId(playlist);
        console.log("PLAYLIST IN SONG TO PLAYLIST ++ " + playlist);
        console.log("SONG IN SONG TO PLAYLIST ++ " + $scope.song_play.name);
        var url = `${host}/playlistsong`;
        var data = {
          song: $scope.song_play,
          playlist: playlist,
        };
        console.log("DATA ++++==" + data.playlist);
        //check song and playlist
        $scope.checkSongNPlaylist = function (playlist, song) {
          console.log("CHEKCECKECJ PLAYLSIT---- " + playlist.id);
          console.log("CHEKCECKECJ SONG---- " + song.id);
          var url2 = `${host}/playlistsong/playlist/${playlist.id}/${song.id}`;
          $http
            .get(url2)
            .then((resp) => {
              $scope.checkSP = resp.data;
              console.log("CHECKING SONG PLAYLIST:", resp.data);
              return resp.data;
            })
            .catch((error) => {
              console.log("SONG IS NOT EXIST");
              console.log("CHECKING SONG PLAYLIST Error", error);
              return null;
            });
          // }
        };
        $scope.checkSongNPlaylist(data.playlist, data.song);

        // console.log("ad;slfhasl;df " +$scope.checkSongNPlaylist(data.playlist, data.song));
        console.log("CEHLEK " + $scope.checkSP);
        if (data.playlist != null && data.song != null) {
          $http
            .post(url, data)
            .then((resp) => {
              console.log("SONG TO PLAYLIST created sssfully:", resp.data);
            })
            .catch((error) => {
              console.log("accountdata Error", error);
            });
        }
      };

      //LẤY TẤT CẢ PLAYLIST CỦA USER TỪ DATA
      $scope.getAllPlaylistByUser = function (userId, callback) {
        // var url = `${host}/playlist/creator/US000001`;
        var url = `${host}/playlist/creator/${userId}`;
        $http
          .get(url)
          .then((resp) => {
            $scope.playlistData = resp.data;
            console.log("getAllPlaylistByUser PLAYLIST USER ++ " + userId);
            if (callback && typeof callback === "function") {
              callback(); // Execute the callback after fetching the song details
            }
          })
          .catch((error) => {
            console.log("playlistSongData Error", error);
          });
      };

      //LẤY DỮ LIỆU song TỪ playlist  VÀ GÁN VÀO BIẾN playlistData
      $scope.getSongPlaylistByPlaylistId = function (playlistId, callback) {
        var url = `${host}/playlistsong/playlist/${playlistId}`;
        $http
          .get(url)
          .then((resp) => {
            $scope.playlistSong = resp.data;
            console.log("PLAYLIST SONG DATA ++ " + $scope.playlistSong);
            if (callback && typeof callback === "function") {
              callback(); // Execute the callback after fetching the song details
            }
          })
          .catch((error) => {
            console.log("playlistSongData Error", error);
          });
      };

      $scope.addNewPlaylist = function () {
        var playlistName = document.getElementById("inputName").value;

        if (!playlistName) {
          console.log("INPUT NULL ");
          return;
        }
        var url = `${host}/playlist`;
        var data = {
          name: playlistName,
          creator: $scope.account,
        };
        console.log("DATA ++ " + data.name);
        $http
          .post(url, data)
          .then((resp) => {
            console.log("Playlist created successfully:", resp.data);
          })
          .catch((error) => {
            console.log("accountdata Error", error);
          });
        $scope.tablePlaylistShow();
        $scope.getAccount();
        var exitBtn = document.getElementById("exitButton").click();
      };
      /*PLAYLIST*/
      $scope.account;
      /*USER*/
      $scope.getAccount = function () {
        var url = `${host}/authorities/profile`;
        $http
          .get(url)
          .then((resp) => {
            $scope.account = resp.data;
            //LẤY USERNAME/ID CỦA USER
            console.log("ACCOUNT DATA ++ " + $scope.account.username);
            $scope.getAllPlaylistByUser($scope.account.username);
            return resp.data;
          })
          .catch((error) => {
            console.log("accountdata Error", error);
          });
      };
      /*USER*/

      //

      $scope.updateSuggestions = function (searchText) {
        if (searchText.trim() === "") {
          $scope.showSuggestions = false; // Ẩn suggestions nếu không có từ khoá tìm kiếm
        } else {
          // Sử dụng filter trên danh sách album để lọc theo từ khoá tìm kiếm
          $scope.filteredAlbums = $scope.album.filter(function (a) {
            return a.title.toLowerCase().includes(searchText.toLowerCase());
          });

          // Kiểm tra xem danh sách filteredAlbums có kết quả không
          $scope.showSuggestions = $scope.filteredAlbums.length > 0;
        }
      };
    }
  );
