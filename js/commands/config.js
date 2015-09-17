export default function (nga, admin) {

    var commands = admin.getEntity('commands');
    commands.listView()
        .sortField('date')
        .sortDir('DESC')
        .fields([
            nga.field('date', 'datetime'),
            nga.field('reference').isDetailLink(true),
            nga.field('customer_id', 'reference')
                .label('Customer')
                .targetEntity(admin.getEntity('customers'))
                .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name))
                .singleApiCall(ids => ({ 'id': ids }))
                .cssClasses('hidden-xs'),
            nga.field('nb_items')
                .map((v,e) => e.basket.length)
                .cssClasses('hidden-xs'),
            nga.field('total', 'amount')
                .cssClasses('hidden-xs'),
            nga.field('status'),
            nga.field('returned', 'boolean')
                .cssClasses('hidden-xs')
        ])
        .filters([
            nga.field('q', 'template')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('customer_id', 'reference')
                .label('Customer')
                .targetEntity(admin.getEntity('customers'))
                .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name))
                .remoteComplete(true, {
                    searchQuery: function(search) { return { q: search }; }
                }),
            nga.field('status', 'choice')
                .choices([
                    { label: 'ordered', value: 'ordered' },
                    { label: 'delivered', value: 'delivered' },
                    { label: 'cancelled', value: 'cancelled' }
                ]),
            nga.field('date_gte', 'datetime')
                .label('Passed since'),
            nga.field('date_lte', 'datetime')
                .label('Passed before'),
            nga.field('total_gte', 'amount')
                .label('Min amount'),
            nga.field('returned', 'boolean')
        ])
        .listActions(['<ma-edit-button entry="::entry" entity="::entity" size="xs" label="Details"></ma-edit-button>']);
    commands.editionView()
        .title('Command #{{ entry.values.reference }}')
        .fields([
            nga.field('date', 'datetime')
                .editable(false),
            nga.field('customer_id', 'reference')
                .label('Customer')
                .targetEntity(admin.getEntity('customers'))
                .targetField(nga.field('last_name').map((v, e) => e.first_name + ' ' + e.last_name))
                .editable(false),
            nga.field('Items', 'template')
                .template('<basket command="entry.values"></basket>'),
            nga.field('status', 'choice')
                .choices([
                    { label: 'ordered', value: 'ordered' },
                    { label: 'delivered', value: 'delivered' },
                    { label: 'cancelled', value: 'cancelled' }
                ])
                .cssClasses('col-sm-4 col-lg-2'),
            nga.field('returned', 'boolean')
        ])

    return commands;
}
