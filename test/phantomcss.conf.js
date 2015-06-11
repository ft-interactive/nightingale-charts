var fs = require( 'fs' );
var phantomcss = require(fs.workingDirectory + '/node_modules/phantomcss');

module.exports = function phantom(casper){

    phantomcss.init( {
        rebase: casper.cli.get( "rebase" ),
        // SlimerJS needs explicit knowledge of this Casper, and lots of absolute paths
        casper: casper,
        libraryRoot:  fs.absolute( fs.workingDirectory + '/node_modules/phantomcss' ),
        screenshotRoot: './test/regression/reference',
        failedComparisonsRoot: './test/regression/failures' ,
        addLabelToFailedImage: false,
        /*
         casper: specific_instance_of_casper,
         fileNameGetter: function overide_file_naming(){},
         onPass: function passCallback(){},
         onFail: function failCallback(){},
         onTimeout: function timeoutCallback(){},
         onComplete: function completeCallback(){},
         hideElements: '#thing.selector',
         addLabelToFailedImage: true,
         outputSettings: {
         errorColor: {
         red: 255,
         green: 255,
         blue: 0
         },
         errorType: 'movement',
         transparency: 0.3
         }*/
    } );

    casper.on( 'remote.message', function ( msg ) {
        this.echo( msg );
    } );

    casper.on( 'error', function ( err ) {
        this.die( "PhantomJS has errored: " + err );
    } );

    casper.on( 'resource.error', function ( err ) {
        casper.log( 'Resource load error: ' + err, 'warning' );
    } );

    return phantomcss;
};
