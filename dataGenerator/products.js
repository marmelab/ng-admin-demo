export default function(db, chance) {
    var products = [];
    var category, width, height;
    var id = 0;
    for (var i = 0; i <= 12 ; i++) {
        category = db.categories[i];
        for (var j = 1; j <= 10; j++) {
            width = chance.floating({min: 100, max: 400, fixed: 2 });
            height = chance.floating({min: 100, max: 400, fixed: 2 });
            products.push({
                id: id++,
                category_id: category.id,
                reference: category.name.substr(0,2) + '-' + chance.string({length: 5, pool: 'abcdefghijklmnopqrstuvwxyz0123456789'}) + '-' + chance.string({length: 1, pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'}),
                width: width,
                height: height,
                price: chance.floating({ min: width*height / 2000, max: width*height / 1500, fixed: 2 }),
                image: 'http://lorempixel.com/' + (width.toFixed()) + '/' + (height.toFixed()) + '/' + category.name + '/' + j,
                stock: chance.bool({likelihood: 20 }) ? 0 : chance.integer({ min: 0, max: 250 })
            })
        };
    }
    return products;
}
