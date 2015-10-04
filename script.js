var app = angular.module('fileUpload', ['ngFileUpload']);

app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {

  $scope.files = [];
  $scope.filesToUpload = 0;
  var isInProgress = false;
  var upload;

  $scope.updateFileList = function(files, newFiles) {
    if (newFiles) {
      $scope.files = $scope.files.concat(newFiles);
      $scope.filesToUpload += newFiles.length;
      var i = $scope.files.length - newFiles.length;
      for (i; i < $scope.files.length; i++) {
        $scope.files[i].progress = 0;
        $scope.files[i].status = true;
      }
    }
    if (!isInProgress) {
      if ($scope.filesToUpload) {
        if ($scope.files[$scope.files.length - $scope.filesToUpload].status) {
          isInProgress = true;
          $scope.uploadFiles($scope.files[$scope.files.length - $scope.filesToUpload]);
        } else {
          $scope.filesToUpload--;
          $scope.updateFileList();
        }
      }
    }
  };

  $scope.uploadFiles = function(file) {
    upload = Upload.upload({
      url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
      data: {
         file: file
      }
    }).progress(function (evt) {
      file.progress = parseInt(100.0 * evt.loaded / evt.total);
    }).success(function (status) {
      isInProgress = false;
      $scope.filesToUpload--;
      $scope.updateFileList();
    });
  };

  $scope.abort = function() {
    upload.abort();
    isInProgress = false;
    $scope.filesToUpload = 0;
    for (var i = 0; i < $scope.files.length; i++) {
      if ($scope.files[i].progress < 100) {
        $scope.files[i].status = false;
      }
    }
  };

  $scope.abortForOneFile = function(index) {
    if ($scope.files[index].progress) {
      upload.abort();
      $scope.files[index].status = false;
      isInProgress = false;
      $scope.updateFileList();
    } else {
      $scope.files[index].status = false;
    }
  };
}]);
