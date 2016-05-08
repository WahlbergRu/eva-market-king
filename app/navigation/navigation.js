app.controller('navigationCtrl', function($scope, $mdSidenav) {
    $scope.todos = [
        {
            link: "marketplace",
            title: "Рынок"
        },
        {
            link: "types",
            title: "Вещи"
        }
    ];

    $mdSidenav('left').toggle();
});