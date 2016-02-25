'use strict';

// import libraries
const Async     = require('async');
const Joi       = require('joi');
const Boom      = require('boom');
const internals = {};

/* Private properties */
internals._instance = null;
internals._constants = {
    task: 'task',
    replaceTaskId: '{taskId}'

};

/**
 * Define {TasksLib} class
 */
class TasksLib {

    constructor() {}

    /**
     * Sets private _server property value
     *
     * @param value
     */
    set server(value) {

        this._server = value;
    }

    /**
     * Returns private _server property value
     *
     * @returns {*}
     */
    get server() {

        return this._server;
    }

    /**
     * Sets private _utils property value
     *
     * @param value
     */
    set utils(value) {

        this._utils = value;
    }

    /**
     * Returns private _utils property value
     *
     * @returns {*}
     */
    get utils() {

        return this._utils;
    }

    /**
     * Sets private _db property value
     *
     * @param value
     */
    set db(value) {

        this._db = value;
    }

    /**
     * Returns private _db property value
     *
     * @returns {*}
     */
    get db() {

        return this._db;
    }

    /**
     * Function to create new task in DB
     *
     * @param payload - Data to insert in DB
     * @param callback - Callback method
     */
    create(payload, callback) {

        this.server.log(['debug'], 'START < Tasks.Lib.create >');

        Async.waterfall(
            [
                (cb) => {

                    Joi.validate(payload, this.utils.schema.createTaskRequest, (err) => {

                        if (err) {
                            return cb(Boom.preconditionFailed(err.message));
                        }

                        cb();
                    });
                },
                (cb) => {

                    // assign new variables
                    const Data = {
                        content: payload.content,
                        creationDate : new Date()
                    };

                    if (payload.status) {
                        Object.assign(Data, { status: payload.status });
                    } else {
                        const aucun = {
                            status: 'Aucun'
                        }
                        Object.assign(Data, { status: aucun.status });
                    }

                    this.server.log(['debug'], '< Tasks.Lib.create > Data to insert in DB => ' + JSON.stringify(Data));

                    // create task in db
                    this.db.tasks.create(Data, (err, task) => {

                        if (err) {
                            return cb(Boom.wrap(err));
                        }

                        if (!task) {
                            return cb(Boom.badData('Task can\'t be created'));
                        }

                        cb(null, task.response());
                    });
                },
                (task, cb) => {

                    this.utils.getUrl(internals._constants.task, null,
                        [
                            {
                                replace: internals._constants.replaceTaskId,
                                value: task.id
                            }
                        ], (err, url) => {

                            if (err) {
                                return cb(Boom.wrap(err));
                            }

                            // add link in response object
                            Object.assign(task, { link: url });

                            cb(null, task);
                        });
                }
            ],
            (err, response) => {

                if (err) {
                    this.server.log(['debug'], 'END < Tasks.Lib.create > with error');

                    return callback(err);
                }

                this.server.log(['debug'], 'END < Tasks.Lib.create >');

                callback(null, response);
            }
        );
    }

    /**
     * Function to read all tasks in DB
     *
     * @param callback - Callback method
     */
    readAll(callback) {

        this.server.log(['debug'], 'START < Tasks.Lib.readAll >');

        Async.waterfall(
            [
                (cb) => {

                    // read all tasks in db
                    this.db.tasks.readAll((err, tasks) => {

                        if (err) {
                            return cb(Boom.wrap(err));
                        }

                        if (!tasks || tasks.length === 0) {
                            this.server.log(['debug'], 'END < Tasks.Lib.readAll > without data');

                            return callback();
                        }

                        cb(null, tasks);
                    });
                },
                (tasks, cb) => {

                    // create links array
                    const links = [];

                    // build link for each tasks
                    Async.each(tasks, (task, c) => {

                        this.utils.getUrl(internals._constants.task, null,
                            [
                                {
                                    replace: internals._constants.replaceTaskId,
                                    value: task._id.toString()
                                }
                            ], (err, url) => {

                                if (err) {
                                    return c(Boom.wrap(err));
                                }

                                // push url in links array
                                links.push(url);

                                c();
                            });
                    }, (err) => {

                        if (err) {
                            return cb(Boom.wrap(err));
                        }

                        cb(null, links);
                    });
                }
            ],
            (err, response) => {

                if (err) {
                    this.server.log(['debug'], 'END < Tasks.Lib.readAll > with error');

                    return callback(err);
                }

                this.server.log(['debug'], 'END < Tasks.Lib.readAll >');

                callback(null, response);
            }
        );
    }

    /**
     * Function to find a task
     *
     * @param params - route parameters
     * @param callback - callback function
     */
    read(params, callback) {

        this.server.log(['debug'], 'START < Tasks.Lib.read >');

        Async.waterfall(
            [
                (cb) => {

                    Joi.validate(params, this.utils.schema.taskRequest, (err) => {

                        if (err) {
                            return cb(Boom.preconditionFailed(err.message));
                        }

                        cb();
                    });
                },
                (cb) => {

                    // get task for current id
                    this.db.tasks.read(params.taskId, (err, task) => {

                        if (err) {
                            return cb(Boom.wrap(err));
                        }

                        if (!task) {
                            return cb(Boom.notFound('No task found for _id `' + params.taskId + '`'));
                        }

                        cb(null, task.response());
                    });
                },
                (task, cb) => {

                    this.utils.getUrl(internals._constants.task, null,
                        [
                            {
                                replace: internals._constants.replaceTaskId,
                                value: task.id
                            }
                        ], (err, url) => {

                            if (err) {
                                return cb(Boom.wrap(err));
                            }

                            // add link in response object
                            Object.assign(task, { link: url });

                            cb(null, task);
                        });
                }
            ],
            (err, response) => {

                if (err) {
                    this.server.log(['debug'], 'END < Tasks.Lib.read > with error');

                    return callback(err);
                }

                this.server.log(['debug'], 'END < Tasks.Lib.read >');

                callback(null, response);
            }
        );
    }

    /**
     * Function to update a task
     *
     * @param params - route parameters
     * @param payload - route payload
     * @param callback - callback function
     */
    update(params, payload, callback) {

        this.server.log(['debug'], 'START < Tasks.Lib.update >');

        Async.waterfall(
            [
                (cb) => {

                    Joi.validate(params, this.utils.schema.taskRequest, (err) => {

                        if (err) {
                            return cb(Boom.preconditionFailed(err.message));
                        }

                        cb();
                    });
                },
                (cb) => {

                    Joi.validate(payload, this.utils.schema.updateTaskRequest, (err) => {

                        if (err) {
                            return cb(Boom.preconditionFailed(err.message));
                        }

                        cb();
                    });
                },
                (cb) => {

                    // create mongo update operator
                    const operator = {
                      $set: {
                          content: payload.content,
                          status: payload.status,
                          modificationDate: new Date()
                      }
                    };

                    // update task for current id
                    this.db.tasks.readAndUpdate(params.taskId, operator, (err, task) => {

                        if (err) {
                            return cb(Boom.wrap(err));
                        }

                        if (!task) {
                            return cb(Boom.notFound('No task updated for _id `' + params.taskId + '`'));
                        }

                        cb(null, task.response());
                    });
                },
                (task, cb) => {

                    this.utils.getUrl(internals._constants.task, null,
                        [
                            {
                                replace: internals._constants.replaceTaskId,
                                value: task.id
                            }
                        ], (err, url) => {

                            if (err) {
                                return cb(Boom.wrap(err));
                            }

                            // add link in response object
                            Object.assign(task, { link: url });

                            cb(null, task);
                        });
                }
            ],
            (err, response) => {

                if (err) {
                    this.server.log(['debug'], 'END < Tasks.Lib.read > with error');

                    return callback(err);
                }

                this.server.log(['debug'], 'END < Tasks.Lib.read >');

                callback(null, response);
            }
        );
    }

    /**
     * Function to delete a task
     *
     * @param params - route parameters
     * @param callback - callback function
     */
    delete(params, callback) {

        this.server.log(['debug'], 'START < Tasks.Lib.delete >');

        Async.waterfall(
            [
                (cb) => {

                    Joi.validate(params, this.utils.schema.taskRequest, (err) => {

                        if (err) {
                            return cb(Boom.preconditionFailed(err.message));
                        }

                        cb();
                    });
                },
                (cb) => {

                    // delete task for current id
                    this.db.tasks.delete(params.taskId, (err, count) => {

                        if (err) {
                            return cb(Boom.wrap(err));
                        }

                        if (count < 1) {
                            return cb(Boom.notFound('No task found for _id `' + params.taskId + '`'));
                        }

                        cb(null, 'Nombre de tâche(s) supprimée(s) : ' + count);
                    });
                }
            ],
            (err, response) => {

                if (err) {
                    this.server.log(['debug'], 'END < Tasks.Lib.delete > with error');

                    return callback(err);
                }

                this.server.log(['debug'], 'END < Tasks.Lib.delete >');

                callback(null, response);
            }
        );
    }

    /**
     * Function to read all tasks with filter in DB
     *
     * @param params - Filter for search
     * @param callback - Callback method
     */
    readAllWithFilter(params, callback) {

        this.server.log(['debug'], 'START < Tasks.Lib.readAllWithFilter >');

        Async.waterfall(
            [

                (cb) => {

                    Joi.validate(params, this.utils.schema.statusRequest, (err) => {

                        if (err) {
                            return cb(Boom.preconditionFailed(err.message));
                        }

                        cb();
                    });
                },
                (cb) => {

                    const filter = {
                        status: params.statusId
                    };

                    // read all tasks with filter in db
                    this.db.tasks.readAllWithFilter(filter, (err, tasks) => {

                        if (err) {
                            return cb(Boom.wrap(err));
                        }

                        if (!tasks || tasks.length === 0) {
                            this.server.log(['debug'], 'END < Tasks.Lib.readAllWithFilter > without data');

                            return callback();
                        }

                        cb(null, tasks);
                    });
                },
                (tasks, cb) => {

                    // create links array
                    const links = [];

                    // build link for each tasks
                    Async.each(tasks, (task, c) => {

                        this.utils.getUrl(internals._constants.task, null,
                            [
                                {
                                    replace: internals._constants.replaceTaskId,
                                    value: task._id.toString()
                                }
                            ], (err, url) => {

                                if (err) {
                                    return c(Boom.wrap(err));
                                }

                                // push url in links array
                                links.push(url);

                                c();
                            });
                    }, (err) => {

                        if (err) {
                            return cb(Boom.wrap(err));
                        }

                        cb(null, links);
                    });
                }
            ],
            (err, response) => {

                if (err) {
                    this.server.log(['debug'], 'END < Tasks.Lib.readAllWithFilter > with error');

                    return callback(err);
                }

                this.server.log(['debug'], 'END < Tasks.Lib.readAllWithFilter >');

                callback(null, response);
            }
        );
    }

    /**
     * Returns singleton instance
     *
     * @returns {null|TasksLib|*}
     */
    static getInstance() {

        // singleton
        if (!(internals._instance instanceof TasksLib)) {
            internals._instance = new TasksLib();
        }

        return internals._instance;
    }
}

/**
 * Expose {TasksLib} class
 *
 * @type {TasksLib}
 */
module.exports = TasksLib;
