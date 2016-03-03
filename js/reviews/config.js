export default function (nga, admin) {
    const statuses = ['pending', 'accepted', 'rejected'];
    const statusChoices = statuses.map(status => ({ label: status, value: status }));

    var reviews = admin.getEntity('reviews');
    reviews.listView()
        .sortField('date')
        .sortDir('DESC')
        .fields([
            nga.field('date', 'datetime'),
            nga.field('customer_id', 'reference')
                .label('Customer')
                .targetEntity(admin.getEntity('customers'))
                .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name))
                .singleApiCall(ids => ({ 'id': ids }))
                .cssClasses('hidden-xs'),
            nga.field('product_id', 'reference')
                .label('Product')
                .targetEntity(admin.getEntity('products'))
                .targetField(nga.field('reference'))
                .singleApiCall(ids => ({ 'id': ids }))
                .cssClasses('hidden-xs'),
            nga.field('rating', 'template')
                .template(entry => `<star-rating stars="${ entry.values.rating }"></star-rating>`),
            nga.field('comment')
                .map(function truncate(value) {
                    if (!value) {
                        return '';
                    }
                    return value.length > 50 ? value.substr(0, 50) + '...' : value;
                })
                .cssClasses('hidden-xs'),
            nga.field('status', 'choice')
                .choices(statusChoices)
                .cssClasses(function(entry) { // add custom CSS classes to inputs and columns
                    if (!entry) return;
                    if (entry.values.status == 'accepted') {
                        return 'text-center bg-success';
                    }
                    if (entry.values.status == 'rejected') {
                        return 'text-center bg-danger';
                    }
                    return 'text-center bg-warning';
                }),
        ])
        .filters([
            nga.field('q', 'template')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('status', 'choice')
                .choices(statusChoices),
            nga.field('customer_id', 'reference')
                .label('Customer')
                .targetEntity(admin.getEntity('customers'))
                .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name))
                .remoteComplete(true, {
                    searchQuery: function(search) { return { q: search }; }
                }),
            nga.field('product_id', 'reference')
                .label('Product')
                .targetEntity(admin.getEntity('products'))
                .targetField(nga.field('reference'))
                .remoteComplete(true, {
                    searchQuery: function(search) { return { q: search }; }
                }),
            nga.field('date_gte', 'datetime')
                .label('Posted since'),
            nga.field('date_lte', 'datetime')
                .label('Posted before')
        ])
        .listActions([
            '<ma-edit-button entry="::entry" entity="::entity" size="xs" label="Details"></ma-edit-button>',
            '<approve-review size="xs" review="entry"></approve-review>',
        ])
        .batchActions([
            '<batch-approve type="accept" selection="selection"></batch-approve>',
            '<batch-approve type="reject" selection="selection"></batch-approve>',
            'delete'
        ]);

    reviews.editionView()
        .fields([
            nga.field('date', 'datetime')
                .editable(false),
            nga.field('customer_id', 'reference')
                .label('Customer')
                .targetEntity(admin.getEntity('customers'))
                .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name))
                .editable(false),
            nga.field('command_id', 'reference')
                .label('Command')
                .targetEntity(admin.getEntity('commands'))
                .targetField(nga.field('reference'))
                .editable(false),
            nga.field('product_id', 'reference')
                .label('Product')
                .targetEntity(admin.getEntity('products'))
                .targetField(nga.field('reference'))
                .editable(false),
            nga.field('rating', 'template')
                .template('<star-rating stars="{{ entry.values.rating }}"></star-rating>')
                .editable(false),
            nga.field('comment', 'text'),
            nga.field('status', 'choice')
                .choices(statusChoices)
        ])
        .actions([
            '<approve-review review="entry"></approve-review>',
            'list',
            'delete'
        ])

    return reviews;
}
