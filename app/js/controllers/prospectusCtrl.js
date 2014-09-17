four51.app.controller('ProspectusCtrl', ['$scope', '$routeParams', '$route', '$location', '$451', 'Product', 'ProductDisplayService', 'Order', 'Variant', 'Prospectus',
function ($scope, $routeParams, $route, $location, $451, Product, ProductDisplayService, Order, Variant, Prospectus) {

    $scope.step = 1;

    Product.get('CBC_HE_PROSPECTUS', function(product) {
        $scope.product = product;
    });

    $scope.submitProspectus = function() {
        angular.forEach($scope.product.Specs, function(spec) {
            if (!spec.Value) {
                spec.Value = spec.DefaultValue;
            }
        });

        var variant = {
            "ProductInteropID":$scope.product.InteropID,
            "Specs": $scope.product.Specs
        };

        Variant.save(variant, function(v) {
            sendEmail(v);
            $scope.step = 2;
        });
    };

    function sendEmail(variant) {
        Prospectus.send(variant, $scope.user);
    }

}]);


