let Backbone = require('backbone')
let Car = require('./Car')

let CarCollection = Backbone.Collection.extend({
    model: Car,

    initialize: function(list, opts) {
        list.map((l) => l.brand = 'Ashton Martine')
    },

    url: function() {
        return `bar/brand/Ashton-Martine`
    },

    parse: function(data) {
        return [data]
    },
})

module.exports = CarCollection
