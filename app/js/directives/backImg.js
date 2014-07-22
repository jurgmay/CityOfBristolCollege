four51.app.directive('backImg', function(){
    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            function randomIntFromInterval(min,max)
            {
                return Math.floor(Math.random()*(max-min+1)+min);
            }

            value = value + randomIntFromInterval(1,5);

            element.css({
                'background-image': 'url(' + value +'.jpg)',
                'background-size' : 'cover'
            });
        });
    };
});