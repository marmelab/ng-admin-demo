var moment = require('moment');
var fromNow = v => moment(v).fromNow();

var segments = require('../utils/segments');

export default function (nga, admin) {

    var customer = admin.getEntity('customers');
    customer.listView()
        .title('Visitors')
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
            nga.field('nb_commands', 'template')
                .label('Commands')
                .template('{{ entry.values.nb_commands ? entry.values.nb_commands : "" }}'),
            nga.field('total_spent', 'template')
                .template('<span ng-if="::entry.values[field.name()]">$<ma-number-column field="::field" value="::entry.values[field.name()]"></ma-number-column></span>'),
            nga.field('latest_purchase', 'datetime'),
            nga.field('has_newsletter', 'boolean')
                .label('Newsletter'),
            nga.field('segments', 'template')
                .template('<span ng-repeat="group in entry.values.groups track by $index" class="label label-default">{{ group }}</span>'),
        ])
        .filters([
            nga.field('q', 'template')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('groups', 'choice')
                .label('Segment')
                .choices(segments),
            nga.field('has_ordered', 'boolean'),
            nga.field('has_newsletter', 'boolean'),
        ])
        .sortField('first_seen')
        .sortDir('DESC')
        .listActions(['edit']);
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
                    nga.field('date', 'datetime')
                        .isDetailLink(true),
                    nga.field('reference')
                        .isDetailLink(true),
                    nga.field('nb_items')
                        .map((v,e) => e.basket.length),
                    nga.field('total', 'amount'),
                    nga.field('status')
                ])
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
                    nga.field('date', 'datetime')
                        .label('Posted')
                        .isDetailLink(true),
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
                .perPage(5)
                .sortField('date')
                .sortDir('DESC'),
            nga.field('reviews button', 'template')
                .label('')
                .template('<ma-filtered-list-button entity-name="reviews" filter="{ customer_id: entry.values.id }"></ma-filtered-list-button>'),
        ])

    return customer;
}
