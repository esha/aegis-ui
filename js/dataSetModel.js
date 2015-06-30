/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global store, Utils */
(function(window) {
    'use strict';

    // Generic "model" object. You can use whatever
    // framework you want. For this application it
    // may not even be worth separating this logic
    // out, but we do this to demonstrate one way to
    // separate out parts of your application.
    var Model = window.AegisUIModel = function(key) {
        this.key = key;
        this.dataSets = store(key) || [];
        this.onChanges = [];
    },
    proto = Model.prototype;

    proto.subscribe = function(onChange) {
        this.onChanges.push(onChange);
    };
    proto.inform = function() {
        store(this.key, this.dataSets);
        this.onChanges.forEach(function(cb) { cb(); });
    };
    proto.addDataSet = function(title) {
        this.dataSets = this.dataSets.concat({
            id: Utils.uuid(),
            title: title,
            completed: false
        });

        this.inform();
    };
    proto.toggleAll = function(checked) {
        // Note: it's usually better to use immutable data structures since they're
        // easier to reason about and React works very well with them. That's why
        // we use map() and filter() everywhere instead of mutating the array or
        // dataSet items themselves.
        this.dataSets = this.dataSets.map(function(dataSet) {
            return Utils.extend({}, dataSet, {completed: checked});
        });

        this.inform();
    };
    proto.toggle = function(dataSetToToggle) {
        this.dataSets = this.dataSets.map(function(dataSet) {
            return dataSet !== dataSetToToggle ?
                dataSet :
                Utils.extend({}, dataSet, {completed: !dataSet.completed});
        });

        this.inform();
    };
    proto.destroy = function(dataSet) {
        this.dataSets = this.dataSets.filter(function(candidate) {
            return candidate !== dataSet;
        });

        this.inform();
    };
    proto.save = function(dataSetToSave, text) {
        this.dataSets = this.dataSets.map(function(dataSet) {
            return dataSet !== dataSetToSave ? dataSet : Utils.extend({}, dataSet, {title: text});
        });

        this.inform();
    };
    proto.clearCompleted = function() {
        this.dataSets = this.dataSets.filter(function(dataSet) {
            return !dataSet.completed;
        });

        this.inform();
    };

})(this);
