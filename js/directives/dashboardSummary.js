var moment = require('moment');
var oneMonthAgo = moment().subtract(1, 'months').toDate();

function dashboardSummary(Restangular) {
    'use strict';

    return {
        restrict: 'E',
        scope: {},
        controller: function($scope) {
            $scope.stats = {};
            Restangular
                .all('commands')
                .getList({range: '[1,100]', sort: '["date","DESC"]'})
                .then(commands => {
                    $scope.stats.commands = commands.data
                        .filter(command => new Date(command.date) > oneMonthAgo)
                        .reduce((stats, command) => {
                            if (command.status != 'cancelled') stats.revenue += command.total;
                            if (command.status == 'ordered') stats.pending_orders++;
                            return stats;
                        }, { revenue: 0, pending_orders: 0})
                });
            Restangular
                .all('customers')
                .getList({range: '[1,100]', sort: '["first_seen","DESC"]', filter: '{"has_ordered":true}'})
                .then(customers => {
                    $scope.stats.customers = customers.data
                        .filter(customer => new Date(customer.first_seen) > oneMonthAgo)
                        .reduce(nb => ++nb, 0)
                });
            Restangular
                .all('reviews')
                .getList({range: '[1,100]', sort: '["date","DESC"]'})
                .then(reviews => {
                    $scope.stats.reviews = reviews.data
                        .filter(review => new Date(review.date) > oneMonthAgo)
                        .reduce(nb => ++nb, 0)
                });
        },
        template: `
<div class="row">
    <div class="col-lg-3">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <i class="fa fa-usd fa-5x"></i>
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge">{{ stats.commands.revenue | number:2 }}</div>
                        <div>Monthly revenue</div>
                    </div>
                </div>
            </div>
            <a ui-sref="list({entity:'commands'})">
                <div class="panel-footer">
                    <span class="pull-left">View Details</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>

        </div>
    </div>
    <div class="col-lg-3">
        <div class="panel panel-green">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <i class="fa fa-shopping-cart fa-5x"></i>
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge">{{ stats.commands.pending_orders }}</div>
                        <div>Pending orders</div>
                    </div>
                </div>
            </div>
            <a ui-sref="list({entity:'commands',search:{status:'ordered'}})">
                <div class="panel-footer">
                    <span class="pull-left">View Details</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>
        </div>
    </div>
    <div class="col-lg-3">
        <div class="panel panel-yellow">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <i class="fa fa-comments fa-5x"></i>
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge">{{ stats.reviews }}</div>
                        <div>New reviews</div>
                    </div>
                </div>
            </div>
            <a ui-sref="list({entity:'reviews'})">
                <div class="panel-footer">
                    <span class="pull-left">View Details</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>
        </div>
    </div>
    <div class="col-lg-3">
        <div class="panel panel-red">
            <div class="panel-heading">
                <div class="row">
                    <div class="col-xs-3">
                        <i class="fa fa-user-plus fa-5x"></i>
                    </div>
                    <div class="col-xs-9 text-right">
                        <div class="huge">{{ stats.customers }}</div>
                        <div>New customers</div>
                    </div>
                </div>
            </div>
            <a ui-sref="list({entity:'customers',search:{has_ordered:true}})">
                <div class="panel-footer">
                    <span class="pull-left">View Details</span>
                    <span class="pull-right"><i class="fa fa-arrow-circle-right"></i></span>
                    <div class="clearfix"></div>
                </div>
            </a>
        </div>
    </div>
</div>
`
    };
}

dashboardSummary.$inject = ['Restangular'];

export default dashboardSummary;
