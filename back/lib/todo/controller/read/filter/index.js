'use strict';

// import libraries
const Boom      = require('boom');
const internals = {}; // Declare internals >> see: http://hapijs.com/styleguide

/**
 * Controller Class definition
 */
class Controller {

    constructor(lib) {
        // store data in private global property
        Object.assign(internals, { _lib: lib });
    }

    /**
     * Function to do controller process
     * @returns {*}
     */
    handler(request, reply) {

        // get route parameters
        const params = request.params;

        request.log(['debug'], 'START < Tasks.Controller.handler.read.filter > Params => ' + JSON.stringify(params));

        // call lib to read all tasks with filter
        internals._lib.readAllWithFilter(params, (err, response) => {

            if (err) {
                request.log(['info'], '< Tasks.Controller.handler.read.filter > An error occurred :');
                request.log(['error'], err);
                request.log(['debug'], 'END < Tasks.Controller.handler.read.filter > with error');

                return reply(Boom.wrap(err));
            }

            if (!response) {
                request.log(['info'], '< Tasks.Controller.handler.read.filter > No task found');

                request.log(['debug'], 'END < Tasks.Controller.handler.read.filter >');

                return reply().code(204);
            }

            request.log(['info'], '< Tasks.Controller.handler.read.filter > All tasks successfully retrieved');

            reply(response);

            request.log(['debug'], 'END < Tasks.Controller.handler.read.filter >');
        });
    }
}

/**
 * Export class
 *
 * @type {Controller}
 */
module.exports = Controller;