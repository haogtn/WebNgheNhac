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

    $scope.edit = function (key) {
        var url = `${host}/authorities/${key}`;
        $http.get(url).then(
            resp => {
                $scope.form = resp.data;
                $scope.load_all();
                // $scope.form.role_id = resp.data.role_id;
                console.log("Success", resp);
            }

        ).catch(error => {

            console.log("Error", error);


        })

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

    $(document).ready(function () {

        var readURL = function (input) {
            if (input.files && input.files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    $('.profile-pic').attr('src', e.target.result);
                }

                reader.readAsDataURL(input.files[0]);
            }
        }

        $(".file-upload").on('change', function () {
            readURL(this);
        });

        $(".upload-button").on('click', function () {
            $(".file-upload").click();
        });
    });

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

    $scope.img = function () {
        // var fileImg = document.getElementById('fileImg').files[0].name;
        // $scope.imgName = fileImg;
        alert($scope.profileData.avatarUrl);
    }


    $scope.updateprofile = function () {
        var url = `${host}/authorities/${$scope.profileData.username}`;
        var formData = {
            username: $scope.profileData.username,
            fullname: $scope.profileData.fullname,
            email: $scope.profileData.email,
            phoneNumber: $scope.profileData.phoneNumber,
            avatarUrl: $scope.profileData.avatarUrl,
            password: $scope.profileData.password,
            accountRole: $scope.profileData.accountRole
        };
        var formImg = new FormData();
        //---------Thêm ảnh vào máy chủ--------------------------
        var fileImg = document.getElementById('fileImg');
        if (fileImg.files.length > 0) {
            formImg.append('file', document.getElementById('fileImg').files[0]);
            var urlImg = `${host}/update/img`;

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

        //--------Update profile------------------------
        $scope.updateProfileData(url, formData);

        //--------End update profile------------------------

    }

    $scope.mess = null;

    $scope.updateProfileData = function (url, formData) {
        $http.put(url, formData).then(
            (resp) => {
                // var index = $scope.items.findIndex((item) => item.username === $scope.profileData.username);
                // $scope.items[index] = resp.data;
                // $scope.items.push(resp.data);
                $scope.mess = "Update profile success";
                console.log("Update profile success", resp);
            },
            (error) => {
                console.log("Update profile error", error);
            }
        );
    };



    $scope.updateImagePreview = function () {
        var fileInput = document.getElementById('fileImg');
        if (fileInput.files.length > 0) {
            var fileName = fileInput.files[0].name;
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.form.imagePath = e.target.result;
                    $scope.profileData.avatarUrl = fileName;

                });
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            // Nếu không có tệp nào được chọn, bạn có thể xử lý theo ý của mình ở đây.
        }

    };
    // // Xử lý sự kiện khi người dùng chọn file
    // $scope.onFileSelect = function (element) {
    //   $scope.selectedFile = element.files[0];
    //   $scope.imgName = element.files[0];
    // };


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

    document.getElementById('fileImg').addEventListener('change', function (event) {
        console.log('Change event triggered.');
        $scope.updateImagePreview();

        // Nếu có mã chặn sự kiện change, bạn có thể thấy thông báo sau trong Console.
        console.log('Event:', event);
    });


    // boolean a=$scope.checkPassword = function () {
    //   if ($scope.form.password && $scope.rePassword) {
    //     $scope.passwordsMatch = ($scope.form.password === $scope.rePassword);
    //     $scope.validPassword = $scope.isPasswordValid($scope.form.password);
    //   } else {
    //     $scope.passwordsMatch = false;
    //     $scope.validPassword = false;
    //   }
    // };

    $scope.isPasswordValid = function (password) {
        return password.length >= 8;
    };
    $scope.load_all();
    $scope.load_allroles();
    $scope.getAccount();
    $scope.reset();
});
