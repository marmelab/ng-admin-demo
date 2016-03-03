var moment = require('moment');
var fromNow = v => moment(v).fromNow();

var segments = require('../segments/segments').choices;

export default function (nga, admin) {

    var customer = admin.getEntity('customers');
    customer.listView()
        .title('Visitors')
        .fields([
            nga.field('avatar', 'template')
                .label('')
                .template(entry => `<img src="${ entry.values.avatar }" width="25" style="margin-top:-5px" />`),
            nga.field('last_name', 'template') // use last_name for sorting
                .label('Name')
                .isDetailLink(true)
                .template('{{ entry.values.first_name }} {{ entry.values.last_name }}'),
            nga.field('last_seen', 'datetime')
                .map(fromNow)
                .cssClasses('hidden-xs'),
            nga.field('nb_commands', 'number')
                .label('Commands')
                .cssClasses(entry => entry && entry.values.nb_commands ? 'hidden-xs' : 'transparent hidden-xs'),
            nga.field('total_spent', 'amount')
                .cssClasses(entry => entry && entry.values.total_spent ? 'hidden-xs' : 'transparent hidden-xs'),
            nga.field('latest_purchase', 'datetime')
                .cssClasses('hidden-xs'),
            nga.field('has_newsletter', 'boolean')
                .label('Newsletter')
                .cssClasses('hidden-xs'),
            nga.field('segments', 'template')
                .template('<span ng-repeat="group in entry.values.groups track by $index" class="label label-default">{{ group }}</span>')
                .cssClasses('hidden-xs'),
        ])
        .filters([
            nga.field('q', 'template')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('groups', 'choice')
                .label('Segment')
                .choices(segments),
            nga.field('last_seen_gte', 'datetime')
                .label('Visited since'),
            nga.field('has_ordered', 'boolean'),
            nga.field('has_newsletter', 'boolean'),
        ])
        .sortField('first_seen')
        .sortDir('DESC')
        .listActions(['edit'])
        .exportFields([
            nga.field('avatar', 'text'),
            nga.field('last_name', 'template').label('Name').template(entry => entry.values.first_name + ' ' + entry.values.last_name),
            nga.field('last_seen', 'datetime'),
            nga.field('nb_commands', 'number').label('Commands'),
            nga.field('total_spent', 'amount'),
            nga.field('latest_purchase', 'datetime'),
            nga.field('has_newsletter', 'boolean').label('Newsletter'),
            nga.field('segments', 'template').template(entry => `${entry.values.groups}`),
        ]);
    customer.editionView()
        .title('<img src="{{ entry.values.avatar }}" width="50" style="vertical-align: text-bottom"/> {{ entry.values.first_name }} {{ entry.values.last_name }}\'s details')
        .fields([
            nga.field('first_name'),
            nga.field('last_name'),
            nga.field('email', 'email'),
            nga.field('address', 'text'),
            nga.field('zipcode'),
            nga.field('city'),
            nga.field('birthday', 'date'),
            nga.field('first_seen', 'datetime')
                .editable(false),
            nga.field('latest_purchase', 'datetime')
                .editable(false),
            nga.field('last_seen', 'datetime')
                .editable(false),
            nga.field('has_newsletter', 'boolean'),
            nga.field('groups', 'choices')
                .choices(segments),
            nga.field('commands', 'referenced_list')
                .label('Latest commands')
                .targetEntity(admin.getEntity('commands'))
                .targetReferenceField('customer_id')
                .targetFields([
                    nga.field('date')
                        .map(fromNow),
                    nga.field('reference')
                        .isDetailLink(true),
                    nga.field('nb_items')
                        .map((v,e) => e.basket.length),
                    nga.field('total', 'amount'),
                    nga.field('status')
                ])
                .listActions(['<ma-edit-button entry="::entry" entity="::entity" size="xs" label="Details"></ma-edit-button>'])
                .perPage(5)
                .sortField('date')
                .sortDir('DESC'),
            nga.field('commands button', 'template')
                .label('')
                .template('<ma-filtered-list-button entity-name="commands" filter="{ customer_id: entry.values.id }"></ma-filtered-list-button>'),
            nga.field('reviews', 'referenced_list')
                .label('Latest reviews')
                .targetEntity(admin.getEntity('reviews'))
                .targetReferenceField('customer_id')
                .targetFields([
                    nga.field('date')
                        .label('Posted')
                        .map(fromNow)
                        .isDetailLink(true),
                    nga.field('product_id', 'reference')
                        .label('Product')
                        .targetEntity(admin.getEntity('products'))
                        .targetField(nga.field('reference')),
                    nga.field('rating', 'template')
                        .template('<star-rating stars="{{ entry.values.rating }}"></star-rating>'),
                    nga.field('comment')
                        .map(function truncate(value) {
                            if (!value) {
                                return '';
                            }
                            return value.length > 50 ? value.substr(0, 50) + '...' : value;
                        }),
                    nga.field('status', 'choice')
                        .choices([
                            { label: 'accepted', value: 'accepted' },
                            { label: 'rejected', value: 'rejected' },
                            { label: 'pending', value: 'pending' }
                        ])
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
                .listActions(['<ma-edit-button entry="::entry" entity="::entity" size="xs" label="Details"></ma-edit-button>'])
                .perPage(5)
                .sortField('date')
                .sortDir('DESC'),
            nga.field('reviews button', 'template')
                .label('')
                .template('<ma-filtered-list-button entity-name="reviews" filter="{ customer_id: entry.values.id }"></ma-filtered-list-button>'),
        ])

    return customer;
}
