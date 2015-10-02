var app = angular.module('fileUpload', ['ngFileUpload']);

app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {

  $scope.filesToUpload = [];
  $scope.allFiles = [];
  $scope.progress = [];
  var isInProgress = false;
  var upload;

  $scope.updateFileList = function(files) {
    if (files) {
      for (var i = 0; i < files.length; i++) {
        $scope.filesToUpload.push(files[i]);
        $scope.allFiles.push(files[i]);
        $scope.progress.push(0);
      }
    }
    if ($scope.filesToUpload.length) {
      if (isInProgress === false) {
        isInProgress = true;
        $scope.uploadFiles($scope.filesToUpload);
      }
    } else {
      isInProgress = false;
    }
  };

  $scope.uploadFiles = function(files) {
    var index = $scope.allFiles.indexOf(files[0]);
    if (files && files.length) {
      upload = Upload.upload({
        url: '',
        data: {
           file: files[0]
        }
      }).progress(function (evt) {
        $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
      }).success(function (status) {
        $scope.filesToUpload.shift();
        isInProgress = false;
        $scope.updateFileList();
      });
    }
  };

  $scope.abort = function() {
    $scope.filesToUpload.length = 0;
    upload.abort();
    isInProgress = false;
    var index = $scope.progress.indexOf(0);
    if (index !== -1) {
      if ($scope.progress[index - 1] < 100) {
        $scope.progress = $scope.progress.splice(0, index - 1);
        $scope.allFiles = $scope.allFiles.splice(0, index - 1);
      } else {
        $scope.progress = $scope.progress.splice(0, index);
        $scope.allFiles = $scope.allFiles.splice(0, index);
      }
    } else {
      $scope.progress = $scope.progress.splice(0, $scope.progress.length - 1);
      $scope.allFiles = $scope.allFiles.splice(0, $scope.allFiles.length - 1);
    }
  };

  $scope.abortForOneFile = function(index) {
    var fileName = $scope.allFiles[index];
    if ($scope.progress[index] !== 0) {
      upload.abort();
      $scope.progress.splice(index, 1);
      $scope.allFiles.splice(index, 1);
      $scope.filesToUpload.shift();
      isInProgress = false;
      $scope.updateFileList();
    } else {
      $scope.progress.splice(index, 1);
      $scope.allFiles.splice(index, 1);
      index = $scope.filesToUpload.indexOf(fileName);
      $scope.filesToUpload.splice(index, 1);
    }
  };
}]);
