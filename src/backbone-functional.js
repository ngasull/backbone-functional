(function (factory) {
    let Backbone

    if (typeof window !== 'undefined') {
        Backbone = window.Backbone
    } else {
        Backbone = require('backbone')
    }

    let BackboneFunctional = factory(Backbone)

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = BackboneFunctional
    } else {
        window.BackboneFunctional = BackboneFunctional
    }

})(function(Backbone) {

    function makeModel(Model, opts, attrs) {

        if (typeof attrs === 'undefined')
            attrs = opts
            opts = null

        return new Model(attrs, opts)
    }

    let FunctionalModel = (function() {

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

        function fetch(Model, opts, attrs) {
            let model = makeModel(Model, attrs, opts)
            return model.fetch().then(() => {
                return model.attributes
            })
        }

        return { create, set, doCall, doApply, invoke, alter, fetch }
    })()

    let FunctionalCollection = (function() {

        function hasBackboneModel(Collection) {
            return !!Collection.__super__.model
        }

        function getList(Collection, models) {
            if (hasBackboneModel(Collection))
                return models.map((model) => model.attributes)
            else
                return models
        }

        function doCollectionMutation(name, Collection, list, ...args) {
            let backboneCollection = makeModel(Collection, list)
            backboneCollection[name].apply(backboneCollection, args)
            return getList(Collection, backboneCollection.models)
        }

        function create(Collection, opts, list) {
            // Backbone handles list copy
            return getList(Collection, makeModel(Collection, opts, list).models)
        }


        function where(Collection, list, attrs) {
            let backboneCollection = makeModel(Collection, list),
                models = backboneCollection.where(attrs)
            return getList(Collection, models)
        }

        function findWhere(Collection, list, attrs) {
            let backboneCollection = makeModel(Collection, list),
                model = backboneCollection.findWhere(attrs)

            if (model) {
                if (hasBackboneModel(Collection))
                    return model.attributes
                else
                    return model
            } else {
                return null
            }
        }

        function fetch(Collection, opts, list) {
            let collec = makeModel(Collection, list, opts)
            return collec.fetch().then(() => {
                return getList(Collection, collec.models)
            })
        }

        let collectionMutationNames = [
            'add', 'remove', 'push', 'pop', 'unshift', 'shift', 'sort'
        ]

        let collectionMutations = {}
        collectionMutationNames.map((name) =>
            collectionMutations[name] = doCollectionMutation.bind(null, name))

        return { create, where, findWhere, fetch, ...collectionMutations }
    })()

    let BackboneFunctional = {
        ...FunctionalCollection,
        ...FunctionalModel,
        Collection: FunctionalCollection,
        Model: FunctionalModel
    }

    return BackboneFunctional
})
