export default function (nga) {

    var products = nga.entity('products');
    products.listView()
        .fields([
            nga.field('i', 'template')
                .isDetailLink(true)
                .label('')
                .template('<img src="{{ entry.values.image }}" style="max-width:25;max-height:25" />'),
            nga.field('reference').isDetailLink(true),
            nga.field('price', 'amount'),
            nga.field('width', 'float')
                .format('0.00'),
            nga.field('height', 'float')
                .format('0.00'),
            nga.field('category_id', 'reference')
                .label('Category')
                .targetEntity(nga.entity('categories'))
                .targetField(nga.field('name')),
            nga.field('stock', 'number'),
        ])
        .filters([
            nga.field('q', 'template')
                .label('')
                .pinned(true)
                .template('<div class="input-group"><input type="text" ng-model="value" placeholder="Search" class="form-control"></input><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span></div>'),
            nga.field('category_id', 'reference')
                .label('Category')
                .targetEntity(nga.entity('categories'))
                .targetField(nga.field('name')),
            nga.field('stock', 'template')
                .label('Out of stock')
                .defaultValue(0)
        ])
        .listActions(['edit', 'delete']);
    products.creationView()
        .fields([
            nga.field('reference')
                .cssClasses('col-sm-4 col-lg-2'),
            nga.field('price', 'amount')
                .cssClasses('col-sm-4 col-lg-2'),
            nga.field('width', 'float')
                .cssClasses('col-sm-4 col-lg-2'),
            nga.field('height', 'float')
                .cssClasses('col-sm-4 col-lg-2'),
            nga.field('category_id', 'reference')
                .label('Category')
                .targetEntity(nga.entity('categories'))
                .targetField(nga.field('name'))
                .cssClasses('col-sm-4 col-lg-2'),
            nga.field('stock', 'number')
                .cssClasses('col-sm-4 col-lg-2'),
            nga.field('image'),
        ]);
    products.editionView()
        .fields(
            products.creationView().fields(),
            nga.field('reviews', 'referenced_list')
                    .targetEntity(nga.entity('reviews'))
                    .targetReferenceField('product_id')
                    .targetFields([
                        nga.field('date', 'datetime')
                            .label('Posted'),
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
                    .sortField('date')
                    .sortDir('DESC')
        );

    return products;
}
