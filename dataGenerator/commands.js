export default function(db, chance) {
    var randomDate = require('./randomDate')(chance);
    var commands = [];
    var i, j, nbProducts, basket;
    for (i = 0; i < 600; i++) {
        nbProducts = chance.weighted([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [30, 20, 5, 2, 1, 1, 1, 1, 1, 1])
        basket = [];
        for (j = 0; j< nbProducts; j++) {
            basket.push({
                product_id: chance.integer({ min: 0, max: 10*13 - 1 }),
                quantity: chance.weighted([1, 2, 3, 4, 5], [10, 5, 3, 2, 1])
            })
        }
        var total_ex_taxes = basket.reduce((total, product) => {
            return total + db.products[product.product_id].price * product.quantity
        }, 0);
        var delivery_fees = chance.floating({min: 3, max: 8, fixed: 2 });
        var tax_rate = chance.pick([0.12, 0.17, 0.20]);
        var taxes = parseFloat(((total_ex_taxes + delivery_fees) * tax_rate).toFixed(2));
        var customer = chance.pick(db.customers.filter(customer => customer.has_ordered));
        var date = randomDate(customer.first_seen, customer.last_seen);
        var today = new Date();
        var aMonthAgo = today.setDate(today.getDate() - 30);
        var status = date > aMonthAgo && chance.bool() ? 'ordered' : chance.weighted(['delivered', 'cancelled'], [10, 1]);
        commands.push({
            id: i,
            reference: chance.string({length: 6, pool: 'abcdefghijklmnopqrstuvwxyz0123456789'}),
            date: date,
            customer_id: customer.id,
            basket: basket,
            total_ex_taxes: total_ex_taxes,
            delivery_fees: delivery_fees,
            tax_rate: tax_rate,
            taxes: taxes,
            total: parseFloat((total_ex_taxes + delivery_fees + taxes).toFixed(2)),
            status: status,
            returned: status == 'delivered' ? chance.bool({ likelihood: 10 }) : false
        })
    };
    return commands;
}
