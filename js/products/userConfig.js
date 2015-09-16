import moment from 'moment';
import productsEditionTemplate from './productsEditionTemplate.html';

var fromNow = v => moment(v).fromNow();

export default function (nga, admin) {

    var products = admin.getEntity('products')
        .label('Posters');
    products.listView()
        .title('All Posters')
        .fields([
            nga.field('i', 'template')
                .isDetailLink(true)
                .label('')
                .template('<img src="{{ entry.values.thumbnail }}" class="poster_mini_thumbnail" />'),
            nga.field('reference').isDetailLink(true),
            nga.field('price', 'amount')
                .cssClasses('hidden-xs'),
            nga.field('width', 'float')
                .format('0.00')
                .cssClasses('hidden-xs'),
            nga.field('height', 'float')
                .format('0.00')
                .cssClasses('hidden-xs'),
            nga.field('category_id', 'reference')
                .label('Category')
                .targetEntity(admin.getEntity('categories'))
                .targetField(nga.field('name'))
                .cssClasses('hidden-xs'),
            nga.field('stock', 'number')
                .cssClasses('hidden-xs'),
        ])
        .filters([
            nga.field('q', 'template')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('category_id', 'reference')
                .label('Category')
                .targetEntity(admin.getEntity('categories'))
                .targetField(nga.field('name')),
            nga.field('width_gte', 'number')
                .label('Min width'),
            nga.field('width_lte', 'number')
                .label('Max width'),
            nga.field('height_gte', 'number')
                .label('Min height'),
            nga.field('height_lte', 'number')
                .label('Max height'),
            nga.field('stock_lte', 'template')
                .label('Low stock')
                .defaultValue(10)
        ])
        .batchActions([])
        .listActions();

    return products;
}
