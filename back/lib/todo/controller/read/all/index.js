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

        request.log(['debug'], 'START < Tasks.Controller.handler.read.all >');

        // call lib to read all tasks
        internals._lib.readAll((err, response) => {

            if (err) {
                request.log(['info'], '< Tasks.Controller.handler.read.all > An error occurred :');
                request.log(['error'], err);
                request.log(['debug'], 'END < Tasks.Controller.handler.read.all > with error');

                return reply(Boom.wrap(err));
            }

            if (!response) {
                request.log(['info'], '< Tasks.Controller.handler.read.all > No task found');

                request.log(['debug'], 'END < Tasks.Controller.handler.read.all >');

                return reply().code(204);
            }

            request.log(['info'], '< Tasks.Controller.handler.read.all > All tasks successfully retrieved');

            reply(response);

            request.log(['debug'], 'END < Tasks.Controller.handler.read.all >');
        });
    }
}

/**
 * Export class
 *
 * @type {Controller}
 */
module.exports = Controller;
