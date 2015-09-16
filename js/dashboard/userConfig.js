var moment = require('moment');
var fromNow = v => moment(v).fromNow();

export default function (nga, admin, $window) {

    var dashboard = nga.dashboard()
        .addCollection(nga.collection(admin.getEntity('customers'))
            .name('new_customers')
            .title('New customers')
            .fields([
                nga.field('avatar', 'template')
                    .label('')
                    .template('<img src="{{ entry.values.avatar }}" width="25" />'),
                nga.field('last_name', 'template') // use last_name for sorting
                    .label('Name')
                    .isDetailLink(true)
                    .template('{{ entry.values.first_name }} {{ entry.values.last_name }}'),
                nga.field('last_seen', 'datetime')
                    .map(fromNow),
            ])
            .permanentFilters({ has_ordered: true })
            .sortField('first_seen')
            .sortDir('DESC')
            .perPage(10)
        )

        if ($window.localStorage.getItem('posters_galore_login') == 'admin') {
            dashboard.template(`
                <div class="row dashboard-starter"></div>
                <dashboard-summary></dashboard-summary>
                <div class="row dashboard-content">
                    <div class="col-lg-6">
                        <div class="panel panel-default">
                            <ma-dashboard-panel collection="dashboardController.collections.pending_orders" entries="dashboardController.entries.pending_orders"></ma-dashboard-panel>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="panel panel-default">
                            <ma-dashboard-panel collection="dashboardController.collections.latest_reviews" entries="dashboardController.entries.latest_reviews"></ma-dashboard-panel>
                        </div>
                        <div class="panel panel-default">
                            <ma-dashboard-panel collection="dashboardController.collections.new_customers" entries="dashboardController.entries.new_customers"></ma-dashboard-panel>
                        </div>
                    </div>
                </div>
            `);
        } else {
            dashboard.template(`
                <div class="row dashboard-starter"></div>
                <dashboard-summary></dashboard-summary>
                <div class="row dashboard-content">
                    <div class="col-lg-6">
                        <div class="panel panel-default">
                            <ma-dashboard-panel collection="dashboardController.collections.new_customers" entries="dashboardController.entries.new_customers"></ma-dashboard-panel>
                        </div>
                    </div>
                </div>
            `);  
        }
    return dashboard;
}
