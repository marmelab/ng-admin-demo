
const mobileNavigation = $rootScope => ({
    restrict: 'E',
    template: require('./mobileNavigation.html'),
    link: ($scope) => {
        const listener = $rootScope.$on('$locationChangeSuccess', () => {
            $scope.isCollapsed = true;
        });
        $rootScope.$on('$destroy', listener);
    },
});

mobileNavigation.$inject = ['$rootScope'];

export default mobileNavigation;
