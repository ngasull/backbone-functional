let should = require('should')

let Backbone = require('backbone')
let BackboneImmutable = require('../backbone-immutable')

let CarCollection = require('./CarCollection')
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
        let cars, testCars = [{
                color: 'indigo',
                edition: 'GTX',
                year: 2015,
            }, {
                color: 'blue',
                year: 2013,
                seats: 3
            }]

        beforeEach(() => {
            cars = testCars.slice()
        })

        it('#create creates a new Array from given backbone collection and Array', () => {
            let carsV1 = ImmutCollection.create(CarCollection,
                { brand: 'Ashton Martine'}, cars)

            // No mutation check
            cars.should.eql(testCars)

            carsV1.should.eql([{
                brand: 'Ashton Martine',
                color: 'indigo',
                edition: 'GTX',
                year: 2015,
                kilometers: 0,
                seats: 4
            }, {
                brand: 'Ashton Martine',
                color: 'blue',
                year: 2013,
                kilometers: 0,
                seats: 3
            }])
        })

        it('#push creates a new Array with the new model attributes at the end', () => {
            let carsV1 = ImmutCollection.create(CarCollection,
                { brand: 'Ashton Martine'}, cars)

            let carsV2 = ImmutCollection.push(CarCollection, carsV1, {
                color: 'black',
                edition: 'GTX',
                year: 2042
            })

            carsV1.should.eql([{
                brand: 'Ashton Martine',
                color: 'indigo',
                edition: 'GTX',
                year: 2015,
                kilometers: 0,
                seats: 4
            }, {
                brand: 'Ashton Martine',
                color: 'blue',
                year: 2013,
                kilometers: 0,
                seats: 3
            }])

            carsV2.should.eql([{
                brand: 'Ashton Martine',
                color: 'indigo',
                edition: 'GTX',
                year: 2015,
                kilometers: 0,
                seats: 4
            }, {
                brand: 'Ashton Martine',
                color: 'blue',
                year: 2013,
                kilometers: 0,
                seats: 3
            }, {
                color: 'black',
                edition: 'GTX',
                year: 2042,
                kilometers: 0,
                seats: 4
            }])
        })

        it('#where filters the collection given the filter object (see Backbone doc)', () => {
            let carsV1 = ImmutCollection.create(CarCollection,
                { brand: 'Ashton Martine'}, cars)

            let carsV2 = ImmutCollection.push(CarCollection, carsV1, {
                color: 'indigo',
                year: 2042
            })

            let carsV3 = ImmutCollection.where(CarCollection, carsV2, {
                color: 'indigo'
            })

            carsV3.should.eql([{
                brand: 'Ashton Martine',
                color: 'indigo',
                edition: 'GTX',
                year: 2015,
                kilometers: 0,
                seats: 4
            }, {
                brand: 'Ashton Martine',
                color: 'indigo',
                year: 2042,
                kilometers: 0,
                seats: 5
            }])
        })

        it('#findWhere returns only the first element given the filter object (see Backbone doc)', () => {
            let carsV1 = ImmutCollection.create(CarCollection,
                { brand: 'Ashton Martine'}, cars)

            let carsV2 = ImmutCollection.push(CarCollection, carsV1, {
                color: 'indigo',
                year: 2042
            })

            let foundCar = ImmutCollection.findWhere(CarCollection, carsV2, {
                color: 'indigo'
            })

            // This assetion is unfortunately false because
            // Backbone deep copies given Array of models.
            // foundCar.should.equal(carsV1[0]).and.equal(carsV2[0])

            foundCar.should.eql(carsV1[0]).and.eql(carsV2[0])
        })

        it('#sort runs sort operation', () => {
            let carsV1 = ImmutCollection.create(CarCollection,
                { brand: 'Ashton Martine'}, cars)

            let carsV2 = ImmutCollection.push(CarCollection, carsV1, {
                color: 'black',
                edition: 'GTX',
                year: 1999
            })

            let SortedCarCollection = CarCollection.extend({ comparator: 'year' })
            let carsV3 = ImmutCollection.sort(SortedCarCollection, carsV2)

            carsV3.should.eql([{
                brand: 'Ashton Martine', // PITFALL: Backbone re-initializes the Collection
                color: 'black',
                edition: 'GTX',
                year: 1999,
                kilometers: 0,
                seats: 4
            }, {
                brand: 'Ashton Martine',
                color: 'blue',
                year: 2013,
                kilometers: 0,
                seats: 3
            }, {
                brand: 'Ashton Martine',
                color: 'indigo',
                edition: 'GTX',
                year: 2015,
                kilometers: 0,
                seats: 4
            }])
        })
    })

    it('exposes shorthands not nested in Model or Collection', () => {
        BackboneImmutable.create.should.equal(BackboneImmutable.Model.create)
        BackboneImmutable.set.should.equal(BackboneImmutable.Model.set)
        BackboneImmutable.doCall.should.equal(BackboneImmutable.Model.doCall)
        BackboneImmutable.doApply.should.equal(BackboneImmutable.Model.doApply)
        BackboneImmutable.invoke.should.equal(BackboneImmutable.Model.invoke)
        BackboneImmutable.alter.should.equal(BackboneImmutable.Model.alter)

        BackboneImmutable.where.should.equal(BackboneImmutable.Collection.where)
        BackboneImmutable.findWhere.should.equal(BackboneImmutable.Collection.findWhere)
        BackboneImmutable.add.should.equal(BackboneImmutable.Collection.add)
        BackboneImmutable.remove.should.equal(BackboneImmutable.Collection.remove)
        BackboneImmutable.push.should.equal(BackboneImmutable.Collection.push)
        BackboneImmutable.pop.should.equal(BackboneImmutable.Collection.pop)
        BackboneImmutable.unshift.should.equal(BackboneImmutable.Collection.unshift)
        BackboneImmutable.shift.should.equal(BackboneImmutable.Collection.shift)
        BackboneImmutable.sort.should.equal(BackboneImmutable.Collection.sort)
    })
})
