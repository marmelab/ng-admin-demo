export default function(db, chance) {
    // set latest purchase date
    db.commands.forEach(command => {
        let customer = db.customers[command.customer_id];
        if (!customer.latest_purchase || customer.latest_purchase < command.date) {
            customer.latest_purchase = command.date;
        }
        customer.total_spent += command.total;
        customer.nb_commands++;
    });

    // add buyer groups
    var customersBySpending = db.commands.reduce((customers, command) => {
        if (!customers[command.customer_id]) {
            customers[command.customer_id] = { nbCommands: 0, total: 0, nbProducts: 0 };
        }
        customers[command.customer_id].nbCommands++;
        customers[command.customer_id].nbProducts += command.basket.length;
        customers[command.customer_id].total += command.total;
        return customers;
    }, {});
    Object.keys(customersBySpending)
        .map(customer_id => {
            if (customersBySpending[customer_id].total > 1500) {
                db.customers[customer_id].groups.push('compulsive')
            }
            if (customersBySpending[customer_id].nbProducts > 10) {
                db.customers[customer_id].groups.push('collector')
            }
            if (customersBySpending[customer_id].nbCommands == 1) {
                db.customers[customer_id].groups.push('ordered once')
            }
        });

    db.customers.map(customer => {
        if (chance.bool({likelihood: 20 })) {
            customer.groups.push('regular');
        }
    })

    // add 'returns' group
    db.commands
        .filter(command => command.returned)
        .forEach(command =>  db.customers[command.customer_id].groups.push('returns'));

    // add 'reviewer' group
    db.reviews.forEach(review => {
        let customer = db.customers[review.customer_id];
        if (customer.groups.indexOf('reviewer') === -1) {
            customer.groups.push('reviewer');
        }
    })
}
