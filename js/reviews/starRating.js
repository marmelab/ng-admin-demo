function starRating() {
    'use strict';

    return {
        restrict: 'E',
        scope: {
        	stars: '@'
        },
        link: function(scope, elm, attrs, ctrl) {
        	scope.starsArray = Array.apply(null, { length: parseInt(scope.stars) }).map(Number.call, Number);
        },
        template: `<i ng-repeat="star in starsArray" class="glyphicon glyphicon-star"></i>`
    };
}

starRating.$inject = [];

export default starRating;
