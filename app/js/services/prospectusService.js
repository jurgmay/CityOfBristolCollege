four51.app.factory('Prospectus', ['$resource', '$451', function($resource, $451) {
    /*function _then(fn, data) {
        if (angular.isFunction(fn))
            fn(data);
    }*/

    var _send = function(variant, user) {
        //mandrill_client = new mandrill.Mandrill('wuy_yqU4xM44FjwrDenzGA'); //Four51 Test Key
        //mandrill_client = new mandrill.Mandrill('SzIKUx5tFAs7Xse7UzvBiQ'); //Four51 Live Key

        //mandrill_client = new mandrill.Mandrill('Ke6eCmBhFJDpxR65jD4fcw'); //Accent Test Key
        mandrill_client = new mandrill.Mandrill('3oXmWhr-hEQqwzqawyH_dQ'); //Accent Live Key

        var template_name = "bristol";
        var firstName = variant.Specs['vFirstName'].Value;
        var lastName = variant.Specs['vLastName'].Value;
        var fullName = firstName + " " + lastName;
        var toEmail = variant.Specs['Email'].Value;
        var pdfURL = variant.ProductionURL.replace('web.four51.com','.four51.com');
        var logo = user.Company.LogoUrl.replace('qa.four51','www.four51');
        var template_content = [
            {
                "name": 'header',
                "content": 'Hello ' + firstName
            },
            {
                "name": 'body',
                "content": '<a style="display: block; text-decoration: none; color: #FFF; background-color: #38c0ff; text-align: center; border-radius: 8px; padding: 5px;" href="' + pdfURL + '" target="_blank">Download my prospectus</a>'
            },
            {
                "name": 'logo',
                "content": '<img src="' + logo + '" style="max-width:100%; padding-bottom:15px;"/>'
            }
        ];
        var message = {
            'subject': 'Your personalised prospectus from City of Bristol College',
            'from_email': 'test@accent.com',
            'from_name': 'City of Bristol College',
            'to': [{
                'email': toEmail,
                'name': fullName,
                'type': 'to'
            }],
            'headers': {
                'Reply-To': 'test@accent.com'
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

    return {
        send: _send
    }
}]);