export default function (nga, admin) {

    var categories = admin.getEntity('categories');
    categories.listView()
        .fields([
            nga.field('name'),
        ])
        .listActions(['<ma-filtered-list-button entity-name="products" filter="{ category_id: entry.values.id }" size="xs" label="Related products"></ma-filtered-list-button>', 'edit', 'delete']);
    categories.creationView()
        .fields([
            nga.field('name')
                .validation({ required: true }),
            nga.field('', 'template')
                .label('')
                .editable(false)
                .template('<span class="pull-right"><ma-filtered-list-button entity-name="products" filter="{ category_id: entry.values.id }" size="sm"></ma-filtered-list-button></span>')

        ]);
    categories.editionView()
        .fields(categories.creationView().fields());

    return categories;
}
