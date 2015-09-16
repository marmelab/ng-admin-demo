export default function (nga, admin) {

    var categories = admin.getEntity('categories');
    categories.listView()
        .fields([
            nga.field('name'),
        ])
        .batchActions([])
        .listActions();
    return categories;
}
