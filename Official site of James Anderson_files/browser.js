
/* Test wrapper
 * Wrapper to allow for testing on multiple domains.
 */

(function(yepnope){
 
    yepnope.addPrefix('url', function(resourceObj) {

        var environment = "dev", //'dev', 'test' or 'production'
            path;

        if (environment === "dev") {
            path = 'http://jamesanderson613.com/wordpress/wp-content/themes/jamesanderson613/static/js/';                  //DEV
        }
        else if (environment === "production") {
            path = 'http://jamesanderson613.s3-website-eu-west-1.amazonaws.com/js/';            //PRODUCTION
        }

        resourceObj.url = path + resourceObj.url;

        return resourceObj;
    });

})(this.yepnope);


yepnope({ 
    load: ['ielt9!url!fix/cufon.font.js'],
    callback: function (url, result, key) {
        //console.log('Loaded in Cufon font fix. ' + url);
    },
    complete: function () {
        //console.log('Finished IE Cufon test.');
    }
});
/*
yepnope({ 
    load: ['url!fix/cufon.font.js'],
    callback: function (url, result, key) {
        console.log('Loading in Cufon font fix.');
    },
    complete: function () {
        console.log('Finished loading in Cufon fonts.');
    }
});
*/
yepnope({ 
    load: ['url!plugins.js','url!script.js'],
    callback: function (url, result, key) {
        //console.log('Loading in script.js. ' + key + ' ' + url);
    },
    complete: function () {
        //console.log('Finished loading script.js');
    }
});