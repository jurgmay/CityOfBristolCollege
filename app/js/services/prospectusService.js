four51.app.factory('Prospectus', ['$resource', '$451', function($resource, $451) {

    var _send = function(variant, user) {
        var mandrill_client = new mandrill.Mandrill('3oXmWhr-hEQqwzqawyH_dQ');

        var template_name = "bristol";
        var firstName = variant.Specs['vFirstName'].Value;
        var lastName = variant.Specs['vLastName'].Value;
        var fullName = firstName + " " + lastName;
        var toEmail = variant.Specs['Email'].Value;
        var pdfURL = variant.ProductionURL.replace('web.four51.com','.four51.com');
        var currentYear = new Date().getFullYear();
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

    return {
        send: _send
    }
}]);