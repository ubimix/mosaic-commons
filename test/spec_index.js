var expect = require('expect.js');
var P = require('..').P;
var _ = require('underscore');

describe('mosaic-commons/P', function() {
    function Divide(a, b, callback) {
        setTimeout(function() {
            try {
                if (!b) throw new Error('Divide by zero.');
                var result = a / b;
                callback(null, result);
            } catch (e) {
                callback(e);
            }
        }, 1);
    }
    function MyObj(a, b) {
        this.a = a;
        this.b = b;
    }
    MyObj.prototype.div = function(callback) {
        Divide(this.a, this.b, callback);
    };
    describe('Static P.nresolver method', function() {
        it('should exist', function() {
            expect(P.nresolver).not.to.be(undefined);
        });
        it('should return successfull execution results', function(done) {
            var deferred = P.defer();
            Divide(10, 2, P.nresolver(deferred));
            deferred.promise.then(function(result) {
                expect(result).to.eql(5);
            }).then(done, done).done();
        });
        it('should properly report failures', function(done) {
            var deferred = P.defer();
            Divide(10, 0, P.nresolver(deferred));
            deferred.promise.then(function(result) {
                throw Error();
            }, function(err) {
                // It is OK
            }).then(done, done).done();
        });
    });

    describe('Static P.nfapply method', function() {
        it('should exist', function() {
            expect(P.nfapply).not.to.be(undefined);
        });
        it('should be able to call Node-like methods', function(done) {
            P.nfapply(Divide, [ 10, 2 ]).then(function(result) {
                expect(result).to.eql(5);
            }).then(done, done);
        });
        it('should properly handle errors', function(done) {
            var failed;
            P.nfapply(Divide, [ 10, 0 ]).then(function() {
                throw new Error('This method should rise an error!');
            }, function(err) {
            }).then(done, done).done();
        });
    });

    describe('Static P.nfcall method', function() {
        it('should exist', function() {
            expect(P.nfcall).not.to.be(undefined);
        });
        it('should be able to call Node-like methods', function(done) {
            P.nfcall(Divide, 10, 2).then(function(result) {
                expect(result).to.eql(5);
            }).then(done, done);
        });
        it('should properly handle errors', function(done) {
            var failed;
            P.nfcall(Divide, 10, 0).then(function() {
                throw new Error('This method should rise an error!');
            }, function(err) {
            }).then(done, done).done();
        });
    });

    describe('Static P.ninvoke method', function() {
        it('should exist', function() {
            expect(P.ninvoke).not.to.be(undefined);
        });
        it('should be able to call Node-like methods', function(done) {
            var obj = new MyObj(10, 2);
            P.ninvoke(obj, 'div').then(function(result) {
                expect(result).to.eql(5);
            }).then(done, done);
        });
        it('should properly handle errors', function(done) {
            var failed;
            var obj = new MyObj(10, 0);
            P.ninvoke(obj, 'div').then(function(result) {
                throw new Error('This method should rise an error!');
            }, function(err) {
            }).then(done, done).done();
        });
    });

    describe('Instance "done" method', function() {
        it('should exist', function() {
            var p = P();
            expect(p.done).not.to.be(undefined);
        });
        it('should finish the execution chain', function() {
            expect(P().done()).to.be(undefined);
        });
    });
    describe('Instance "finally" method', function() {
        it('should exist', function() {
            var p = P();
            expect(p['finally']).not.to.be(undefined);
        });
        it('should be called after positive results', function(done) {
            var called = false;
            P().then(function() {
                return 'abc';
            })['finally'](function() {
                called = true;
                return 'cde';
            }).then(function(result) {
                expect(result).to.eql('abc');
                expect(called).to.be(true);
            }).then(done, done).done();
        });
        it('should be called after a failure', function(done) {
            var called = false;
            P().then(function() {
                throw new Error();
            })['finally'](function() {
                called = true;
                return 'cde';
            }).then(null, function(err) {
                expect(called).to.be(true);
            }).then(done, done).done();
        });
    });
});