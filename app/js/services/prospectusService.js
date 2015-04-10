four51.app.factory('Prospectus', ['$resource', '$451', 'Order', 'AddressList', 'User', function($resource, $451, Order, AddressList, User) {

    var _send = function(variant, user) {
        var mandrill_client = new mandrill.Mandrill('3oXmWhr-hEQqwzqawyH_dQ');

        var template_name = "bristol";
        var firstName = variant.Specs['vFirstName'].Value;
        var lastName = variant.Specs['vLastName'].Value;
        var fullName = firstName + " " + lastName;
        var toEmail = variant.Specs['Email'].Value;
        var pdfURL = variant.ProductionURL.replace('web.four51.com','.four51.com');
        var currentYear = new Date().getFullYear();
        var printCopy = variant.Specs['vPrintCopy'] ? variant.Specs['vPrintCopy'].Value : null;
        var template_content = [
            {
                "name": 'firstname',
                "content": firstName
            },
            {
                "name": 'download',
                "content": '<a class="mcnButton " title="Download your guide now!" href="' + pdfURL + '" target="_blank" style="font-weight: normal;letter-spacing: 0px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">Download your guide now!</a>'
            },
            {
                "name": 'currentyear',
                "content": currentYear
            },
            {
                "name": 'PRINTCOPY',
                "content": printCopy
            }
        ];
        var message = {
            'subject': 'Your personalised prospectus from City of Bristol College',
            'from_email': 'info@accent.uk.com',
            'from_name': 'City of Bristol College',
            'to': [{
                'email': toEmail,
                'name': fullName,
                'type': 'to'
            }],
            'headers': {
                'Reply-To': 'info@accent.uk.com'
            },
            'important': false
        };
        var async = false;
        var ip_pool = "Main Pool";

        mandrill_client.messages.sendTemplate({"template_name": template_name, "template_content": template_content, "message": message, "async": async, "ip_pool": ip_pool}, function(result) {
            console.log(result);
        }, function(e) {
            console.log('A Mandrill error occurred: ' + e.name + ' - ' + e.message);
        });
    };

    var _createOrder = function(variant, product, user, success) {
        var lineItem = {
            Variant: variant,
            Quantity: "1",
            Product: product,
            DateNeeded: new Date()
        };
        var order = {
            LineItems: [lineItem]
        };
        Order.save(order, function(data) {
            AddressList.query(function (list, count) {
                angular.forEach(list, function(address) {
                    if (address.AddressName == 'South Bristol Skills Academy') {
                        data.ShipAddressID = address.ID;
                        data.LineItems[0].ShipAddressID = address.ID;
                    }
                });

                data.PaymentMethod = 'PurchaseOrder';
                data.CostCenter = "Prospectus";
                data.ExternalID = 'auto';
                user.FirstName = variant.Specs['vFirstName'].Value;
                user.LastName = variant.Specs['vLastName'].Value;
                user.Email = variant.Specs['Email'].Value;
                User.save(user, function(u) {
                    u.CurrentOrderID = data.ID;
                    Order.submit(data,
                        function(o) {
                            success(o);
                        },
                        function(ex) {
                            success(ex);
                        });
                });
            }, 1, 100);
        });
    };

    return {
        send: _send,
        createOrder: _createOrder
    }
}]);