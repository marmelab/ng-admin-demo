function approveReview(Restangular, $state, notification) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            review: "&",
            size: "@",
        },
        link: function(scope, element, attrs) {
            scope.review = scope.review();
            scope.type = attrs.type;
            scope.approve = function(status) {
                Restangular
                    .one('reviews', scope.review.values.id).get()
                    .then(review => {
                        review.data.status = status;
                        return review.data.put();
                    })
                    .then(() => $state.reload())
                    .then(() => notification.log('Review ' + status, { addnCls: 'humane-flatty-success' }) )
                    .catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e) )
            }
        },
        template:
` <a ng-if="review.values.status == 'pending'" class="btn btn-outline btn-success" ng-class="size ? \'btn-\' + size : \'\'" ng-click="approve('accepted')">
    <span class="glyphicon glyphicon-thumbs-up" aria-hidden="true"></span>&nbsp;Accept
</a>
<a ng-if="review.values.status == 'pending'" class="btn btn-outline btn-danger" ng-class="size ? \'btn-\' + size : \'\'" ng-click="approve('rejected')">
    <span class="glyphicon glyphicon-thumbs-down" aria-hidden="true"></span>&nbspReject
</a>`
    };
}

approveReview.$inject = ['Restangular', '$state', 'notification'];

export default approveReview;
