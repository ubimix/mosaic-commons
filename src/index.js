if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(
// Dependencies
[ 'require', './Class', './Errors', './Events', './P' ],
// Module
function(require) {
    var Mosaic = module.exports = {};
    Mosaic.Class = require('./Class');
    Mosaic.Errors = require('./Errors');
    Mosaic.Events = require('./Events');
    Mosaic.P = require('./P');
    return Mosaic;
});
