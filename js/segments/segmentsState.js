import segmentsTemplate from './segmentsTemplate.html';
import segments from './segments';

export default function ($stateProvider) {
    $stateProvider.state('segments', {
        parent: 'ng-admin',
        url: '/segments',
        params: { },
        controller: ['$scope', ($scope) => {
            $scope.segments = segments.values;
        }],
        template: segmentsTemplate
    });
};
