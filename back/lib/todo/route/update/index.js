'use strict';

// import libraries
const Hoek       = require('hoek');
const Controller = require('../../controller/update');
const internals  = {}; // Declare internals >> see: http://hapijs.com/styleguide

/**
 * Route Class definition
 */
class Route {

    constructor(lib, options) {

        // check options
        Hoek.assert(options, 'options are required for token routes'); // pre-auth checks
        Hoek.assert(options.endPoints, 'options must contain endPoints function to have good schema'); // no schema
        Hoek.assert(options.endPoints.task, 'endPoints must contain task function to have good schema'); // no schema
        Hoek.assert(options.schema, 'options must contain schema function to have good schema'); // no schema
        Hoek.assert(options.schema.taskRequest, 'schema must contain taskRequest value to have good schema'); // no schema
        Hoek.assert(options.schema.updateTaskRequest, 'schema must contain updateTaskRequest value to have good schema'); // no schema
        Hoek.assert(options.schema.taskResponse, 'schema must contain taskResponse value to have good schema'); // no schema

        // store data in private global property
        Object.assign(internals, {
            _lib: lib,
            _method: 'PUT',
            _path: options.endPoints.task,
            _schema: {
                params: options.schema.taskRequest,
                request: options.schema.updateTaskRequest,
                response: options.schema.taskResponse
            },
            _controller: new Controller(lib)
        });
    }

    /**
     * Function to return new instance of HapiJS route object
     *
     * @returns {{method: string, path: string, handler: handler, config: {validate: {payload: *},
     *            response: {status: {200: *}}, payload: {output: string, allow: string, parse: boolean}}}}
     */
    definition() {

        return {
            method: internals._method,
            path: internals._path,
            handler: (request, reply) => {

                return internals._controller.handler(request, reply);
            },
            config: {
                validate:
                {
                    params: internals._schema.params,
                    payload: internals._schema.request
                },
                response: {
                    status: {
                        200: internals._schema.response
                    }
                },
                payload:
                {
                    output: 'data',
                    allow: 'application/json',
                    parse: true
                }
            }
        };
    }
}

/**
 * Export class
 *
 * @type {Route}
 */
module.exports = Route;
