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
            sendEmail(v);
            $scope.step = 3;
        });
    }

    $scope.$watch('product.Specs.Mobile.Value', function(newval, oldval) {
        if (newval) {
            $scope.product.Specs.Mobile.Value = $scope.product.Specs.Mobile.Value.replace(/\D/g,'');
        }
    });

    function sendEmail(variant) {
        mandrill_client = new mandrill.Mandrill('wuy_yqU4xM44FjwrDenzGA');
        var template_name = "bristol";
        var firstName = variant.Specs['vFirstName'].Value;
        //var toEmail = variant.Specs['Email'].Value;
        var pdfURL = variant.ProductionURL;
        var template_content = [
            {
                "name": 'header',
                "content": 'Hello ' + firstName
            },
            {
                "name": 'body',
                "content": '<a href="' + pdfURL + '" target="_blank">Download Now!</a>'
            }
        ];
        var message = {
            'subject': 'Test email subject',
            'from_email': 'testmail@four51.com',
            'from_name': 'Test User',
            'to': [{
                /*'email': toEmail,*/
                'email': 'kolson@four51.com',
                'name': 'Kyle Olson',
                'type': 'to'
            }],
            'headers': {
                'Reply-To': 'demomail@four51.com'
            },
            'important': false
        };
        var async = false;
        var ip_pool = "Main Pool";

        mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool}, function(result) {
            console.log(result);
        }, function(e) {
            console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        });
    }

}]);


