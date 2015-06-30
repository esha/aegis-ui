/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
/*global React, classNames */
(function() {
    'use strict';

    var AegisUI = window.AegisUI;
    window.AegisUI.Footer = React.createClass({
        render: function() {
            var activeDataSetWord = Utils.pluralize(this.props.count, 'item');
            var clearButton = null;

            if (this.props.completedCount > 0) {
                clearButton = (
                    <button
                        id="clear-completed"
                        onClick={this.props.onClearCompleted}>
                        Clear completed
                    </button>
                );
            }

            // React idiom for shortcutting to `classSet` since it'll be used often
            var nowShowing = this.props.nowShowing;
            return (
                <footer id="footer">
                    <span id="dataSet-count">
                        <strong>{this.props.count}</strong> {activeDataSetWord} left
                    </span>
                    <ul id="filters">
                        <li>
                            <a
                                href="#/"
                                className={classNames({selected: nowShowing === AegisUI.ALL_DATASETS})}>
                                    All
                            </a>
                        </li>
                        {' '}
                        <li>
                            <a
                                href="#/active"
                                className={classNames({selected: nowShowing === AegisUI.ACTIVE_DATASETS})}>
                                    Active
                            </a>
                        </li>
                        {' '}
                        <li>
                            <a
                                href="#/completed"
                                className={classNames({selected: nowShowing === AegisUI.COMPLETED_DATASETS})}>
                                    Completed
                            </a>
                        </li>
                    </ul>
                    {clearButton}
                </footer>
            );
        }
    });
})();
