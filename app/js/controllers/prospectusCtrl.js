four51.app.controller('ProspectusCtrl', ['$scope', '$routeParams', '$route', '$location', '$451', 'Product', 'ProductDisplayService', 'Order', 'Variant', 'User',
function ($scope, $routeParams, $route, $location, $451, Product, ProductDisplayService, Order, Variant, User) {

    $scope.step = 1;

    Product.get('CBC_HE_PROSPECTUS', function(product) {
        $scope.product = product;
    });

    $scope.nextStep = function() {
        $scope.step = 2;
    }

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
            console.log(v);
            $scope.step = 3;
        });
    }

    $scope.$watch('product.Specs.Mobile.Value', function(newval, oldval) {
        if (newval) {
            $scope.product.Specs.Mobile.Value = $scope.product.Specs.Mobile.Value.replace(/\D/g,'');
        }
    });

}]);


