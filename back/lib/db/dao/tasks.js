'use strict';

// import libraries
const Dao        = require('../class/dao');
const internals  = {};

/* Private properties */
internals._instance = null;

/**
 * Define {TasksDao} class
 */
class TasksDao extends Dao {

    constructor() {

        // call super constructor
        super('Tasks');
    }

    /**
     * Returns singleton instance
     *
     * @returns {null|TasksDao|*}
     */
    static getInstance() {

        // singleton
        if (!(internals._instance instanceof TasksDao)) {
            internals._instance = new TasksDao();
        }

        return internals._instance;
    }
}

/**
 * Expose {TasksDao} class
 *
 * @type {TasksDao}
 */
module.exports = TasksDao;
