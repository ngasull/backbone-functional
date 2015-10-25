let should = require('should')

let $ = require('jquery')
let Backbone = require('backbone')
let BackboneFunctional = require('../backbone-functional')

let CarCollection = require('./CarCollection')
let Car = require('./Car')

Backbone.$ = $

$.ajax = (opts) => {
    opts.success({ foo: 'bar', url: opts.url })
    return new Promise((resolve) => {
        resolve()
    })
}

describe('BackboneFunctional', () => {

    describe('Model', () => {

        let fnModel = BackboneFunctional.Model

        it('#create creates a new object from given model and attributes', () => {

            let car = fnModel.create(Car, {
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

            let car = fnModel.create(Car)

            car.should.have.properties({
                year: 2015,
                seats: 5
            })
        })

        it('#set changes attributes and returns an updated version of the object', () => {

            let carV1 = fnModel.create(Car, {
                color: 'indigo'
            })

            let carV2 = fnModel.set(Car, carV1, {
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
            let carV1 = fnModel.create(Car)
            let [carV2, kilometers] = fnModel.doCall(Car, carV1, 'drive', 42)

            carV2.should.not.equal(carV1)
            carV1.kilometers.should.equal(0)
            carV2.kilometers.should.equal(42)
            kilometers.should.equal(42)
        })

        it('#doCall\'s target function can receive no argument', () => {
            let carV1 = fnModel.create(Car)
            let [carV2, kilometers] = fnModel.doCall(Car, carV1, 'drive')

            carV2.should.not.equal(carV1)
            carV1.kilometers.should.equal(0)
            carV2.kilometers.should.equal(10)
            kilometers.should.equal(10)
        })

        it('#doApply applies arguments to an object method and returns an array of 2 values: [newAttrs, returnedValue]', () => {
            let carV1 = fnModel.create(Car)
            let [carV2, kilometers] = fnModel.doApply(Car, carV1, 'drive', [42])

            carV2.should.not.equal(carV1)
            carV1.kilometers.should.equal(0)
            carV2.kilometers.should.equal(42)
            kilometers.should.equal(42)
        })

        it('#invoke is a sugar to return returnedValue from #doApply', () => {
            let car = fnModel.create(Car)
            let kilometers = fnModel.invoke(Car, car, 'drive', 42)

            car.kilometers.should.equal(0)
            kilometers.should.equal(42)
        })

        it('#alter is a sugar to return newAttrs from #doApply', () => {
            let carV1 = fnModel.create(Car)
            let carV2 = fnModel.alter(Car, carV1, 'drive', 42)

            carV2.should.not.equal(carV1)
            carV1.kilometers.should.equal(0)
            carV2.kilometers.should.equal(42)
        })

        it('#fetch triggers an ajax call using model\'s configuration', () => {

            return fnModel.fetch(Car, {
                color: 'indigo',
                edition: 'GTX'
            }).then((car) => {
                car.should.have.properties({
                    color: 'indigo',
                    edition: 'GTX',
                    year: 2015,
                    seats: 4,
                    serverAttrs: {
                        foo: 'bar',
                        url: 'foo/year/2015/seats/4'
                    }
                })
            })
        })
    })

    describe('Collection', () => {

        let fnCollection = BackboneFunctional.Collection
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
            let carsV1 = fnCollection.create(CarCollection, cars)

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
            let carsV1 = fnCollection.create(CarCollection, cars)

            let carsV2 = fnCollection.push(CarCollection, carsV1, {
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
            let carsV1 = fnCollection.create(CarCollection, cars)

            let carsV2 = fnCollection.push(CarCollection, carsV1, {
                color: 'indigo',
                year: 2042
            })

            let carsV3 = fnCollection.where(CarCollection, carsV2, {
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
            let carsV1 = fnCollection.create(CarCollection, cars)

            let carsV2 = fnCollection.push(CarCollection, carsV1, {
                color: 'indigo',
                year: 2042
            })

            let foundCar = fnCollection.findWhere(CarCollection, carsV2, {
                color: 'indigo'
            })

            // This assetion is unfortunately false because
            // Backbone deep copies given Array of models.
            // foundCar.should.equal(carsV1[0]).and.equal(carsV2[0])

            foundCar.should.eql(carsV1[0]).and.eql(carsV2[0])
        })

        it('#sort runs sort operation', () => {
            let carsV1 = fnCollection.create(CarCollection, cars)

            let carsV2 = fnCollection.push(CarCollection, carsV1, {
                color: 'black',
                edition: 'GTX',
                year: 1999
            })

            let SortedCarCollection = CarCollection.extend({ comparator: 'year' })
            let carsV3 = fnCollection.sort(SortedCarCollection, carsV2)

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

        it('#fetch triggers an ajax call using collection\'s configuration', () => {

            return fnCollection.fetch(CarCollection, []).then((collec) => {
                collec.length.should.equal(1)
                collec[0].should.have.properties({
                    color: 'white',
                    year: 2015,
                    seats: 5,
                    kilometers: 0,
                })
                collec[0].serverAttrs.should.have.properties({
                    foo: 'bar',
                    url: 'bar/brand/Ashton-Martine'
                })
            })
        })
    })

    it('exposes shorthands not nested in Model or Collection', () => {
        BackboneFunctional.create.should.equal(BackboneFunctional.Model.create)
        BackboneFunctional.set.should.equal(BackboneFunctional.Model.set)
        BackboneFunctional.doCall.should.equal(BackboneFunctional.Model.doCall)
        BackboneFunctional.doApply.should.equal(BackboneFunctional.Model.doApply)
        BackboneFunctional.invoke.should.equal(BackboneFunctional.Model.invoke)
        BackboneFunctional.alter.should.equal(BackboneFunctional.Model.alter)

        BackboneFunctional.where.should.equal(BackboneFunctional.Collection.where)
        BackboneFunctional.findWhere.should.equal(BackboneFunctional.Collection.findWhere)
        BackboneFunctional.add.should.equal(BackboneFunctional.Collection.add)
        BackboneFunctional.remove.should.equal(BackboneFunctional.Collection.remove)
        BackboneFunctional.push.should.equal(BackboneFunctional.Collection.push)
        BackboneFunctional.pop.should.equal(BackboneFunctional.Collection.pop)
        BackboneFunctional.unshift.should.equal(BackboneFunctional.Collection.unshift)
        BackboneFunctional.shift.should.equal(BackboneFunctional.Collection.shift)
        BackboneFunctional.sort.should.equal(BackboneFunctional.Collection.sort)
    })
})
