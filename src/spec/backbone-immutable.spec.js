let should = require('should')

let Backbone = require('backbone')
let BackboneImmutable = require('../backbone-immutable')

let Car = require('./Car')

describe('BackboneImmutable', () => {

    describe('Model', () => {

        let ImmutModel = BackboneImmutable.Model

        it('#create creates a new object from given model and attributes', () => {

            let car = ImmutModel.create(Car, {
                color: 'indigo',
                edition: 'GTX'
            })

            car.should.have.properties({
                color: 'indigo',
                edition: 'GTX',
                year: 2015,
                seats: 4
            })
        })

        it('#create can receive no attributes', () => {

            let car = ImmutModel.create(Car)

            car.should.have.properties({
                year: 2015,
                seats: 5
            })
        })

        it('#set changes attributes and returns an updated version of the object', () => {

            let carV1 = ImmutModel.create(Car, {
                color: 'indigo'
            })

            let carV2 = ImmutModel.set(Car, carV1, {
                edition: 'GTX'
            })

            carV1.should.not.equal(carV2)

            carV1.should.have.properties({
                color: 'indigo',
                year: 2015,
                seats: 5
            })

            carV2.should.have.properties({
                color: 'indigo',
                edition: 'GTX',
                year: 2015,
                seats: 4
            })
        })

        it('#doCall calls an object method and returns an array of 2 values: [newAttrs, returnedValue]', () => {
            let carV1 = ImmutModel.create(Car)
            let [carV2, kilometers] = ImmutModel.doCall(Car, carV1, 'drive', 42)

            carV2.should.not.equal(carV1)
            carV1.kilometers.should.equal(0)
            carV2.kilometers.should.equal(42)
            kilometers.should.equal(42)
        })

        it('#doCall\'s target function can receive no argument', () => {
            let carV1 = ImmutModel.create(Car)
            let [carV2, kilometers] = ImmutModel.doCall(Car, carV1, 'drive')

            carV2.should.not.equal(carV1)
            carV1.kilometers.should.equal(0)
            carV2.kilometers.should.equal(10)
            kilometers.should.equal(10)
        })

        it('#doApply applies arguments to an object method and returns an array of 2 values: [newAttrs, returnedValue]', () => {
            let carV1 = ImmutModel.create(Car)
            let [carV2, kilometers] = ImmutModel.doApply(Car, carV1, 'drive', [42])

            carV2.should.not.equal(carV1)
            carV1.kilometers.should.equal(0)
            carV2.kilometers.should.equal(42)
            kilometers.should.equal(42)
        })

        it('#invoke is a sugar to return returnedValue from #doApply', () => {
            let car = ImmutModel.create(Car)
            let kilometers = ImmutModel.invoke(Car, car, 'drive', 42)

            car.kilometers.should.equal(0)
            kilometers.should.equal(42)
        })

        it('#alter is a sugar to return newAttrs from #doApply', () => {
            let carV1 = ImmutModel.create(Car)
            let carV2 = ImmutModel.alter(Car, carV1, 'drive', 42)

            carV2.should.not.equal(carV1)
            carV1.kilometers.should.equal(0)
            carV2.kilometers.should.equal(42)
        })
    })

    describe('Collection', () => {

        let ImmutCollection = BackboneImmutable.Collection

        it('#create creates a new Array from given backbone collection and Array', () => {

        })
    })

    it('exposes shorthands not nested in Model or Collection', () => {
        BackboneImmutable.create.should.equal(BackboneImmutable.Model.create)
        BackboneImmutable.set.should.equal(BackboneImmutable.Model.set)
        BackboneImmutable.doCall.should.equal(BackboneImmutable.Model.doCall)
        BackboneImmutable.doApply.should.equal(BackboneImmutable.Model.doApply)
        BackboneImmutable.invoke.should.equal(BackboneImmutable.Model.invoke)
        BackboneImmutable.alter.should.equal(BackboneImmutable.Model.alter)
    })
})
