let Backbone = require('backbone')
let Car = require('./Car')

let CarCollection = Backbone.Collection.extend({
    model: Car,

    initialize: function(list, opts) {
        list.map((l) => l.brand = 'Ashton Martine')
    }
})

module.exports = CarCollection
