'use strict';

// import libraries
const Joi          = require('joi');
const BaseModel    = require('hapi-mongo-models').BaseModel;
const internals    = {};

/**
 * List of RegExp to validate schema
 *
 * @type {RegExp}
 * @private
 */
internals._regex = {
    identifier: /^[a-z\d\-\_]{1,}$/
};


/**
 * Model Class definition
 */
internals.TasksModel = BaseModel.extend({

    constructor: function (attrs) {
        // override object attributes
        Object.assign(this, attrs);
    },
    response: function () {
        // create response object
        const Data = {
            id: this._id.toString(),
            content: this.content
        };

        if (this.status) {
            Object.assign(Data, { status: this.status });
        }

        if (this.creationDate) {
            Object.assign(Data, { creationDate: this.creationDate });
        }

        if (this.modificationDate) {
            Object.assign(Data, { modificationDate: this.modificationDate });
        }

        return Data;
    }
});

/**
 * Define collection name
 *
 * @type {string}
 * @private
 */
internals.TasksModel._collection = 'tasks';

/**
 * Define collection indexes
 *
 * @type {*[]}
 */
 /*
internals.TasksModel.indexes = [
    {
        key: {
            'status': 1
        },
        name: 'tasks_status',
        background: true
    }
];*/

/**
 * Define validation schema
 */
internals.TasksModel.schema = Joi.object().keys({
    content: Joi.string().required(),
    status: Joi.string(),
    creationDate: Joi.date().iso().required(),
    modificationDate: Joi.date().iso()
}).required();

/**
 * Export class
 *
 * @type {TasksModel}
 */
module.exports = internals.TasksModel;
