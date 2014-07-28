var expect = require('expect.js');
var Class = require('..').Class;
var _ = require('underscore');

describe('mosaic-commons/Class', function() {
    it('should add dynamic prototype method', function() {
        var MyClass = Class.extend({
            myMethod : function() {
                return 'abc';
            }
        });
        expect(!!MyClass).to.eql(true);
        var obj = new MyClass();
        expect(typeof obj.myMethod).to.eql('function');
        expect(obj.getClass()).to.be(MyClass);
        expect(MyClass.hasInstance(obj)).to.be(true);
        expect(obj.instanceOf(MyClass)).to.be(true);
    });

    var FirstClass = Class.extend({
        myMethod : function() {
            return 'abc';
        }
    });
    var SecondClass = FirstClass.extend({
        myMethod : function() {
            return 'cde';
        }
    });
    var ThirdClass = SecondClass.extend({
        myMethod : function() {
            return 'efg';
        }
    });

    describe('should build clean class hierarchy', function() {
        it('Type.parent static property ' + // 
        ' should reference parent type', function() {
            expect(FirstClass.parent).to.be(Class);
            expect(SecondClass.parent).to.be(FirstClass);
            expect(ThirdClass.parent).to.be(SecondClass);
            expect(ThirdClass.parent.parent).to.be(FirstClass);
        });

        it('Type.isSameType function ' + //
        'should return true for the same type', function() {
            expect(FirstClass.isSameType(FirstClass)).to.be(true);
            expect(FirstClass.isSameType(SecondClass)).to.be(false);
            expect(FirstClass.isSameType(ThirdClass)).to.be(false);
            expect(SecondClass.isSameType(FirstClass)).to.be(false);
            expect(SecondClass.isSameType(SecondClass)).to.be(true);
            expect(SecondClass.isSameType(ThirdClass)).to.be(false);
            expect(ThirdClass.isSameType(FirstClass)).to.be(false);
            expect(ThirdClass.isSameType(SecondClass)).to.be(false);
            expect(ThirdClass.isSameType(ThirdClass)).to.be(true);
        });

        it('Type.isSubtype function ' + //
        'should return true for subtypes', function() {
            expect(FirstClass.isSubtype(Class)).to.be(true);
            expect(FirstClass.isSubtype(FirstClass)).to.be(false);
            expect(FirstClass.isSubtype(FirstClass, true)).to.be(true);
            expect(FirstClass.isSubtype(SecondClass)).to.be(false);
            expect(FirstClass.isSubtype(SecondClass, true)).to.be(false);
            expect(FirstClass.isSubtype(ThirdClass)).to.be(false);
            expect(FirstClass.isSubtype(ThirdClass, true)).to.be(false);
        });
    });

    describe('should build class instances', function() {
        var first = new FirstClass();
        var second = new SecondClass();
        var third = new ThirdClass();

        it('obj.instanceOf(Type) should ' + //
        'return true for the type and its parents', function() {
            expect(first.instanceOf(Class)).to.be(true);
            expect(first.instanceOf(FirstClass)).to.be(true);
            expect(first.instanceOf(SecondClass)).to.be(false);
            expect(first.instanceOf(ThirdClass)).to.be(false);
            expect(second.instanceOf(Class)).to.be(true);
            expect(second.instanceOf(FirstClass)).to.be(true);
            expect(second.instanceOf(SecondClass)).to.be(true);
            expect(second.instanceOf(ThirdClass)).to.be(false);
            expect(third.instanceOf(Class)).to.be(true);
            expect(third.instanceOf(FirstClass)).to.be(true);
            expect(third.instanceOf(SecondClass)).to.be(true);
            expect(third.instanceOf(ThirdClass)).to.be(true);
        });

        it('Type.hasInstance(obj) should return true ' + //
        'for instances of this type and its children', function() {
            expect(Class.hasInstance(first)).to.be(true);
            expect(FirstClass.hasInstance(first)).to.be(true);
            expect(SecondClass.hasInstance(first)).to.be(false);
            expect(ThirdClass.hasInstance(first)).to.be(false);
            expect(Class.hasInstance(second)).to.be(true);
            expect(FirstClass.hasInstance(second)).to.be(true);
            expect(SecondClass.hasInstance(second)).to.be(true);
            expect(ThirdClass.hasInstance(second)).to.be(false);
            expect(Class.hasInstance(third)).to.be(true);
            expect(FirstClass.hasInstance(third)).to.be(true);
            expect(SecondClass.hasInstance(third)).to.be(true);
            expect(ThirdClass.hasInstance(third)).to.be(true);
        });

        it('instances should return right type', function() {
            expect(first.getClass()).to.be(FirstClass);
            expect(second.getClass()).to.be(SecondClass);
            expect(third.getClass()).to.be(ThirdClass);
        });

        it('instances should return expected method call results', function() {
            expect(first.myMethod()).to.be('abc');
            expect(second.myMethod()).to.be('cde');
            expect(third.myMethod()).to.be('efg');
        });

    });
});