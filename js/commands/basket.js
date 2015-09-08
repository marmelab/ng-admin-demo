function basket(Restangular, $q) {
    'use strict';

    return {
        restrict: 'E',
        scope: {
        	command: '='
        },
        controller: function($scope) {
            $scope.productsById = {};
        	let productIds = $scope.command.basket
                .map(item => item.product_id)
                .reduce((previous, current) => {
                    if (previous.indexOf(current) === -1) previous.push(current)
                    return previous;
                }, []);
            let promises = productIds
                .map(product_id => {
                    return Restangular.one('products', product_id).get();
                });
            $q.all(promises).then(products => {
                let productsById = {};
                products.forEach(product => {
                    productsById[product.data.id] = product.data;
                });
                $scope.productsById = productsById
            })
            $scope.$watch('command', function(command) {
                if (Object.keys($scope.productsById).length === 0) return;
                command.basket = command.basket.filter(item => item.quantity > 0);
                command.total_ex_taxes = command.basket.reduce((total, item) => {
                    total += $scope.productsById[item.product_id].price * item.quantity
                    return parseFloat(total.toFixed(2));
                }, 0);
                command.taxes = command.tax_rate * (command.total_ex_taxes + command.delivery_fees);
                let total = command.total_ex_taxes + command.delivery_fees + command.taxes;
                command.total = parseFloat(total.toFixed(2));
            }, true);
        },
        template: `
<table class="grid table table-condensed img-thumbnail items">
<thead>
<tr>
    <th class="col-md-1"></th>
    <th class="col-md-3">Reference</th>
    <th class="col-md-2 ng-admin-type-amount">Unit Price</th>
    <th class="col-md-3">Quantity</th>
    <th class="col-md-3 ng-admin-type-amount">Total</th>
</tr>
</thead>
<tbody>
<tr ng-repeat="item in command.basket">
    <td><img src="{{ productsById[item.product_id].thumbnail }}" class="poster_mini_thumbnail" /></td>
    <td><a ui-sref="edit({entity: 'products', id: item.product_id })"> {{ productsById[item.product_id].reference }}</a></td>
    <td class="ng-admin-type-amount">\${{ productsById[item.product_id].price }}</td>
    <td><input class="form-control input-sm" type="number" min="0" ng-model="item.quantity"/></td>
    <td class="ng-admin-type-amount">\${{ productsById[item.product_id].price * item.quantity | number: 2 }}</td>
</td>
<tr>
    <td colspan="3"></td>
    <td>Sum</td>
    <td class="ng-admin-type-amount">\${{ command.total_ex_taxes }}</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td>Delivery</td>
    <td class="ng-admin-type-amount"><div class="input-group"><span class="input-group-addon ng-binding">$</span><input class="form-control delivery_fees input-sm" type="number" min="0" step="any" ng-model="command.delivery_fees"/></div></td>
</tr>
<tr>
    <td colspan="3"></td>
    <td>Tax rate</td>
    <td class="ng-admin-type-number">{{ command.tax_rate * 100}}%</td>
</tr>
<tr>
    <td colspan="3"></td>
    <td><strong>Total</strong></td>
    <td class="ng-admin-type-amount"><strong>\${{ command.total }}</strong></td>
</tr>
</tbody>
</table>
`
    };
}

basket.$inject = ['Restangular', '$q'];

export default basket;
