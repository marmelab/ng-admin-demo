var moment = require('moment');
var fromNow = v => moment(v).fromNow();

export default function (nga, admin) {

    return nga.dashboard()
        .addCollection(nga.collection(admin.getEntity('commands'))
                .name('monthly_revenue')
                .title('Monthly revenue')
                //.permanentFilters({ date: { gte: moment().substract(1, 'months').toDate() } })
                .fields([
                    nga.field('date', 'datetime'),
                    nga.field('total', 'amount')
                ])
                .sortField('date')
                .sortDir('ASC')
                .perPage(100)
        )
        .addCollection(nga.collection(admin.getEntity('commands'))
            .name('pending_orders')
            .title('Pending orders')
            .fields([
                nga.field('date', 'datetime').isDetailLink(true),
                nga.field('reference'),
                nga.field('customer_id', 'reference')
                    .label('Customer')
                    .targetEntity(admin.getEntity('customers'))
                    .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name))
                    .singleApiCall(ids => ({ 'id': ids }))
                    .cssClasses('hidden-xs'),
                nga.field('nb_items')
                    .map((v,e) => e.basket.length),
                nga.field('total', 'amount')
                    .cssClasses('amount')
            ])
            .permanentFilters({status: 'ordered'})
            .sortField('date')
            .sortDir('DESC')
        )
        .addCollection(nga.collection(admin.getEntity('reviews'))
            .name('latest_reviews')
            .title('Latest reviews')
            .fields([
                nga.field('customer_id', 'reference')
                    .label('Customer')
                    .targetEntity(admin.getEntity('customers'))
                    .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name))
                    .singleApiCall(ids => ({ 'id': ids })),,
                nga.field('product_id', 'reference')
                    .label('Product')
                    .targetEntity(admin.getEntity('products'))
                    .targetField(nga.field('reference'))
                    .singleApiCall(ids => ({ 'id': ids })),,
                nga.field('rating', 'template')
                    .template('<star-rating stars="{{ entry.values.rating }}"></star-rating>'),
            ])
            .sortField('date')
            .sortDir('DESC')
            .perPage(10)
        )
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
        .template(`
<div class="row dashboard-starter"></div>
<dashboard-summary></dashboard-summary>
<div class="row dashboard-content">
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.pending_orders" entries="dashboardController.entries.pending_orders" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
    <div class="col-lg-6">
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.latest_reviews" entries="dashboardController.entries.latest_reviews" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
        <div class="panel panel-default">
            <ma-dashboard-panel collection="dashboardController.collections.new_customers" entries="dashboardController.entries.new_customers" datastore="dashboardController.datastore"></ma-dashboard-panel>
        </div>
    </div>
</div>
`);
}
