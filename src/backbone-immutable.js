(function (factory) {
    let Backbone

    if (typeof window !== 'undefined') {
        Backbone = window.Backbone
    } else {
        Backbone = require('backbone')
    }

    let BackboneImmutable = factory(Backbone)

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BackboneImmutable
    } else {
        window.BackboneImmutable = BackboneImmutable
    }

})(function(Backbone) {

    function makeModel(Model, opts, attrs) {

        if (arguments.length < 3)
            attrs = opts
            opts = null

        return new Model(attrs, opts)
    }

    let BackboneImmutableModel = (function() {

        function create(Model, opts, attrs) {
            return makeModel(Model, attrs, opts).attributes
        }

        function set(Model, attrs, extraAttrs) {
            return create(Model, {...attrs, ...extraAttrs})
        }

        function doApply(Model, attrs, fnName, args = []) {
            let model = makeModel(Model, attrs),
                res = model[fnName].apply(model, args)

            return [model.attributes, res]
        }

        function doCall(Model, attrs, fnName, ...args) {
            return doApply(Model, attrs, fnName, args)
        }

        function alter(Model, attrs, fnName, ...args) {
            return doApply(Model, attrs, fnName, args)[0]
        }

        function invoke(Model, attrs, fnName, ...args) {
            return doApply(Model, attrs, fnName, args)[1]
        }

        return { create, set, doCall, doApply, invoke, alter }
    })()

    let BackboneImmutableCollection = (function() {

    })()

    let BackboneImmutable = {
        ...BackboneImmutableCollection,
        ...BackboneImmutableModel,
        Collection: BackboneImmutableCollection,
        Model: BackboneImmutableModel
    }

    return BackboneImmutable
})
