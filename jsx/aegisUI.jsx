/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, Router */
(function(window) {
    'use strict';

    var AegisUI = window.AegisUI = {
        ALL_DATASETS: 'all',
        ACTIVE_DATASETS: 'active',
        COMPLETED_DATASETS: 'completed'
    };

    var ENTER_KEY = 13;

    AegisUI.Main = React.createClass({
        getInitialState: function() {
            return {
                nowShowing: AegisUI.ALL_DATASETS,
                editing: null
            };
        },
        componentDidMount: function() {
            var setState = this.setState;
            var router = Router({
                '/': setState.bind(this, {nowShowing: AegisUI.ALL_DATASETS}),
                '/active': setState.bind(this, {nowShowing: AegisUI.ACTIVE_DATASETS}),
                '/completed': setState.bind(this, {nowShowing: AegisUI.COMPLETED_DATASETS})
            });
            router.init('/');
        },
        handleNewDataSetKeyDown: function(event) {
            if (event.keyCode !== ENTER_KEY) {
                return;
            }

            event.preventDefault();

            var val = React.findDOMNode(this.refs.newField).value.trim();

            if (val) {
                this.props.model.addDataSet(val);
                React.findDOMNode(this.refs.newField).value = '';
            }
        },

        toggleAll: function(event) {
            var checked = event.target.checked;
            this.props.model.toggleAll(checked);
        },
        toggle: function(dataSetToToggle) {
            console.log('toggle', dataSetToToggle, this.props.model);
            this.props.model.toggle(dataSetToToggle);
        },
        destroy: function(dataSet) {
            this.props.model.destroy(dataSet);
        },
        edit: function(dataSet) {
            this.setState({editing: dataSet.id});
        },
        save: function(dataSetToSave, text) {
            this.props.model.save(dataSetToSave, text);
            this.setState({editing: null});
        },
        cancel: function() {
            this.setState({editing: null});
        },
        clearCompleted: function() {
            this.props.model.clearCompleted();
        },

        render: function() {
            var footer;
            var main;
            var dataSets = this.props.model.dataSets;

            var shownDataSets = dataSets.filter(function(dataSet) {
                switch (this.state.nowShowing) {
                case AegisUI.ACTIVE_DATASETS:
                    return !dataSet.completed;
                case AegisUI.COMPLETED_DATASETS:
                    return dataSet.completed;
                default:
                    return true;
                }
            }, this);

            var dataSets = shownDataSets.map(function(dataSet) {
                return (
                    <AegisUI.DataSet
                        key={dataSet.id}
                        dataSet={dataSet}
                        onToggle={this.toggle.bind(this, dataSet)}
                        onDestroy={this.destroy.bind(this, dataSet)}
                        onEdit={this.edit.bind(this, dataSet)}
                        editing={this.state.editing === dataSet.id}
                        onSave={this.save.bind(this, dataSet)}
                        onCancel={this.cancel}
                    />
                );
            }, this);

            var activeDataSetCount = dataSets.reduce(function(accum, dataSet) {
                return dataSet.completed ? accum : accum + 1;
            }, 0);

            var completedCount = dataSets.length - activeDataSetCount;

            if (activeDataSetCount || completedCount) {
                footer =
                    <AegisUI.Footer
                        count={activeDataSetCount}
                        completedCount={completedCount}
                        nowShowing={this.state.nowShowing}
                        onClearCompleted={this.clearCompleted}
                    />;
            }

            if (dataSets.length) {
                main = (
                    <section id="main">
                        <input
                            id="toggle-all"
                            type="checkbox"
                            onChange={this.toggleAll}
                            checked={activeDataSetCount === 0}
                        />
                        <ul id="dataSet-list">
                            {dataSets}
                        </ul>
                    </section>
                );
            }

            return (
                <div>
                    <header id="header">
                        <h1>DataSets</h1>
                        <input
                            ref="newField"
                            id="new-dataSet"
                            placeholder="What needs to be done?"
                            onKeyDown={this.handleNewDataSetKeyDown}
                            autoFocus={true}
                        />
                    </header>
                    {main}
                    {footer}
                </div>
            );
        }
    });

    window.addEventListener('DOMContentLoaded', function() {
        var model = new AegisUIModel('aegis-ui-model');

        function render() {
            React.render(
                <AegisUI.Main model={model}/>,
                document.getElementById('aegisUI')
            );
        }

        model.subscribe(render);
        render();
    });

})(this);
