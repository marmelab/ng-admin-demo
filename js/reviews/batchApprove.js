function batchApprove(Restangular, $q, notification, $state) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
            selection: '=',
            type: '@'
        },
        link: function(scope, element, attrs) {
            const status = attrs.type == 'accept' ? 'accepted' : 'rejected';
            scope.icon = attrs.type == 'accept' ? 'glyphicon-thumbs-up' : 'glyphicon-thumbs-down';
            scope.label = attrs.type == 'accept' ? 'Accept' : 'Reject';
            scope.updateStatus = function() {
                $q.all(scope.selection.map(e => Restangular.one('reviews', e.values.id).get()))
                    .then(reviewReponses => reviewReponses.map(r => r.data))
                    .then(reviews => reviews.map(review => { // your API my support batch updates, this one doesn't, so we iterate
                        review.status = status;
                        return review.put(); // review.put() is a promise
                    })) // this executes all put() promises in parallel and returns
                    .then(() => $state.reload())
                    .then(() => notification.log(scope.selection.length + ' reviews ' + status, { addnCls: 'humane-flatty-success' }) )
                    .catch(e => notification.log('A problem occurred, please try again', { addnCls: 'humane-flatty-error' }) && console.error(e) )
            }
        },
        template: ` <span ng-click="updateStatus()"><span class="glyphicon {{ icon }}" aria-hidden="true"></span>&nbsp;{{ label }}</span>`
    };
}

batchApprove.$inject = ['Restangular', '$q', 'notification', '$state'];

export default batchApprove;
