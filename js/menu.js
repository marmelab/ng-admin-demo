export default function (nga, customers, categories, products, reviews, commands) {
    return nga.menu()
        .addChild(nga.menu(customers)
            .icon('<span class="fa fa-user fa-fw"></span>'))
        .addChild(nga.menu(commands)
            .icon('<span class="fa fa-shopping-cart fa-fw"></span>'))
        .addChild(nga.menu().title('Catalog')
            .icon('<span class="fa fa-th-list fa-fw"></span>')
            .addChild(nga.menu(categories)
                .icon('<span class="fa fa-tags fa-fw"></span>'))
            .addChild(nga.menu(products)
                .icon('<span class="fa fa-picture-o fa-fw"></span>'))
        )
        .addChild(nga.menu(reviews)
            .icon('<span class="fa fa-comments fa-fw"></span>'))
    ;
}
