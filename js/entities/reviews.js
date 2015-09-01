export default function (nga) {

    var reviews = nga.entity('reviews');
    reviews.listView()
        .sortField('date')
        .sortDir('DESC')
        .fields([
            nga.field('date', 'datetime'),
            nga.field('customer_id', 'reference')
                .label('Customer')
                .targetEntity(nga.entity('customers'))
                .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name)),
            nga.field('product_id', 'reference')
                .label('Product')
                .targetEntity(nga.entity('products'))
                .targetField(nga.field('reference')),
            nga.field('rating', 'template')
                .template('<star-rating stars="{{ entry.values.rating }}"></star-rating>'),
            nga.field('comment')
                .map(function truncate(value) {
                    if (!value) {
                        return '';
                    }
                    return value.length > 50 ? value.substr(0, 50) + '...' : value;
                })
        ])
        .filters([
            nga.field('q', 'template')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('customer_id', 'reference')
                .label('Customer')
                .targetEntity(nga.entity('customers'))
                .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name))
                .remoteComplete(true, {
                    searchQuery: function(search) { return { q: search }; }
                }),
            nga.field('product_id', 'reference')
                .label('Product')
                .targetEntity(nga.entity('products'))
                .targetField(nga.field('reference'))
                .remoteComplete(true, {
                    searchQuery: function(search) { return { q: search }; }
                }),
        ])
        .listActions(['show', 'delete']);

    reviews.showView()
        .fields([
            nga.field('date', 'datetime'),
            nga.field('customer_id', 'reference')
                .label('Customer')
                .targetEntity(nga.entity('customers'))
                .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name)),
            nga.field('command_id', 'reference')
                .label('Command')
                .targetEntity(nga.entity('commands'))
                .targetField(nga.field('reference')),
            nga.field('product_id', 'reference')
                .label('Product')
                .targetEntity(nga.entity('products'))
                .targetField(nga.field('reference')),
            nga.field('rating', 'template')
                .template('<star-rating stars="{{ entry.values.rating }}"></star-rating>'),
            nga.field('comment')
        ])

    return reviews;
}
