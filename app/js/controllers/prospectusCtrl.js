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

    function checkDate(date) {
        if (!date) return true;

        var minYear = 1902;
        var maxYear = (new Date()).getFullYear();

        // regular expression to match required date format
        var re = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

        if(date != '') {
            var regs = date.match(re)
            if(regs) {
                if(regs[1] < 1 || regs[1] > 31) {
                    return false;
                } else if(regs[2] < 1 || regs[2] > 12) {
                    return false;
                } else if(regs[3] < minYear || regs[3] > maxYear) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    }

    $scope.$watch('product.Specs.DateOfBirth.Value', function() {
        if (!$scope.product || !$scope.product.Specs) return;
        $scope.form_1.DateOfBirth.$setValidity('DateOfBirth', checkDate($scope.product.Specs.DateOfBirth.Value));
    });

}]);


