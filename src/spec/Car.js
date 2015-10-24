let Backbone = require('backbone')

let Car = Backbone.Model.extend({

    defaults: function() {
        return {
            color: 'white',
            year: 2015,
            seats: 5,
            kilometers: 0
        }
    },

    initialize: function() {
        if (this.get('edition') === 'GTX') {
            this.set('seats', 4)
        }
    },

    drive: function(kilometers = 10) {
        let newKilometers = this.get('kilometers') + kilometers
        this.set('kilometers', newKilometers)
        return newKilometers
    }
})

module.exports = Car
