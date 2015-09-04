var md5 = require('md5');

export default function(db, chance) {
    var randomDate = require('./randomDate')(chance);
    var customers = [];
    for (var i = 0; i < 900; i++) {
        var first_seen = randomDate();
        var last_seen = randomDate(first_seen)
        var has_ordered = chance.bool({likelihood: 25})
        var email = chance.email();
        var groups = [];
        customers.push({
            id: i,
            first_name: chance.first(),
            last_name: chance.last(),
            email: email,
            address: has_ordered ? chance.address() : null,
            zipcode: has_ordered ? chance.zip() : null,
            city: has_ordered ? chance.city() : null,
            avatar: 'http://robohash.org/' + md5(email) + '.png',
            birthday: has_ordered ? chance.birthday() : null,
            first_seen: first_seen,
            last_seen: last_seen,
            has_ordered: has_ordered,
            latest_purchase: null, // finalize
            has_newsletter: has_ordered ? chance.bool({likelihood: 30}) : true,
            groups: [], // finalize
            nb_commands: 0,
            total_spent: 0
        })
    };
    return customers;
}
