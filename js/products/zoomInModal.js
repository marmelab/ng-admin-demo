const zoomInModal = ($modal) => {
    return {
        restrict: 'E',
        scope: {
            thumbnail: "@",
            image: "@",
        },
        link: (scope) => {
            scope.zoomThumbnail = ($event) => {
                $event.preventDefault();
                $modal.open({
                    backdrop: true,
                    scope: scope,
                    controller: ['$scope', '$modalInstance', ($scope, $modalInstance) => {
                        $scope.close = () => $modalInstance.close();
                    }],
                    template:
                        `<div class="modal-header"><h4>Zoom</h4></div>
                        <div class="modal-body">
                            <img src="{{ image }}" class="img-thumbnail img-responsive"/>
                        </div>
                        <div class="modal-footer">
                            <button ng-click="close()" class="btn btn-success" >
                                Close
                            </button>
                        </div>`
                });
            }
        },
        template:
            `<img src="{{ thumbnail }}" class="poster_mini_thumbnail" ng-click="zoomThumbnail($event, image)"/>`
    };
}

zoomInModal.$inject = ['$modal'];

export default zoomInModal;
