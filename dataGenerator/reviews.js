const moment = require('moment');

export default function(db, chance) {
    var randomDate = require('./randomDate')(chance);
    var reviews = [];
    var i = 0;
    var reviewers = db.customers
        .filter(customer => customer.has_ordered)
        .filter(customer => chance.bool({ likelihood: 60 })) // only 60% of buyers write reviews
        .map(customer => customer.id);
    db.commands
        .filter(command => reviewers.indexOf(command.customer_id) !== -1)
        .forEach(command => {
            var basket = command.basket;
            basket
                .filter(p => chance.bool({ likelihood: 40 })) // reviewers review 40% of their products
                .map(product => {
                    const date = randomDate(command.date);
                    const status = moment(date).isBefore(moment().subtract(1, 'months')) ? chance.weighted(['accepted', 'rejected'], [3, 1]) : chance.weighted(['pending', 'accepted', 'rejected'], [5, 3, 1]);
                    reviews.push({
                        id: i++,
                        date: date,
                        status: status,
                        command_id: command.id,
                        product_id: product.product_id,
                        customer_id: command.customer_id,
                        rating: chance.integer({min: 1, max: 5}),
                        comment: chance.paragraph()
                    });
                });
        });
    return reviews;
}
