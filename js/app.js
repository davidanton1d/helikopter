requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

// Start the main app logic.
requirejs(['jquery', 'quack', 'app/classes'],
function   ($,        quack,  classes) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
    
    var myWorld = new classes.World({'fps':20});
    var car = new classes.Vehicle("ford");
    console.log(myWorld);
});


// For debug
window.r = function(js, name){
    if(name === undefined){
        var jsname = js.split("/");
        jsname = jsname[jsname.length-1];
    }else{
        var jsname = name;
    }
    window[jsname] = require(js);
    return "Lib " + js + " loaded. Access it byt typing \"" + jsname + ".xxx\"";
}
// r('app/classes');
// r('jquery', '$');