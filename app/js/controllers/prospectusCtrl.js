four51.app.controller('ProspectusCtrl', ['$scope', '$routeParams', '$route', '$location', '$451', 'Product', 'ProductDisplayService', 'Order', 'Variant', 'Prospectus',
function ($scope, $routeParams, $route, $location, $451, Product, ProductDisplayService, Order, Variant, Prospectus) {

    $scope.step = 'form';

    Product.get('CBC_HE_PROSPECTUS', function(product) {
        $scope.product = product;
    });


    $scope.submitProspectus = function() {
        $scope.step = 'loading';
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
            Prospectus.createOrder(v, $scope.product, $scope.user, function(data) {
                $scope.loadingIndicator = false;
                $scope.step = 'confirmation';
            });
        });
    };

    function sendEmail(variant) {
        Prospectus.send(variant, $scope.user);
    }

}]);


