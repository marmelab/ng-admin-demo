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
                .template('<img src="{{ entry.values.avatar }}" width="25" style="margin-top:-5px" />'),
            nga.field('last_name', 'template') // use last_name for sorting
                .label('Name')
                .isDetailLink(true)
                .template('{{ entry.values.first_name }} {{ entry.values.last_name }}'),
            nga.field('last_seen', 'datetime')
                .map(fromNow)
                .cssClasses('hidden-xs'),
            nga.field('nb_commands', 'template')
                .label('Commands')
                .template('{{ entry.values.nb_commands ? entry.values.nb_commands : "" }}')
                .cssClasses('hidden-xs'),
            nga.field('total_spent', 'template')
                .template('<div class="amount" ng-if="::entry.values[field.name()]">$<ma-number-column field="::field" value="::entry.values[field.name()]"></ma-number-column></div>')
                .cssClasses('hidden-xs text-right'),
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
        .batchActions([])
        .listActions();

    return customer;
}
