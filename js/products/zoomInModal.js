const zoomInModal = ($uibModal) => {
    return {
        restrict: 'E',
        scope: {
            thumbnail: "@",
            image: "@",
        },
        link: (scope) => {
            scope.zoomThumbnail = ($event) => {
                $event.preventDefault();
                $uibModal.open({
                    backdrop: true,
                    scope: scope,
                    controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                        $scope.close = () => $uibModalInstance.close();
                    }],
                    template:
                        `<div class="modal-header"><h4>Zoom</h4></div>
                        <div class="modal-body">
                            <img ng-src="{{ image }}" class="img-thumbnail img-responsive"/>
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
            `<img src="{{ thumbnail }}" class="poster_mini_thumbnail" ng-click="zoomThumbnail($event)"/>`
    };
}

zoomInModal.$inject = ['$uibModal'];

export default zoomInModal;
