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

        request.log(['debug'], 'START < Tasks.Controller.handler.read.one > Params => ' + JSON.stringify(params));

        // call lib to read one task
        internals._lib.read(params, (err, response) => {

            if (err) {
                request.log(['info'], '< Tasks.Controller.handler.read.one > An error occurred :');
                request.log(['error'], err);
                request.log(['debug'], 'END < Tasks.Controller.handler.read.one > with error');

                return reply(Boom.wrap(err));
            }

            request.log(['info'], '< Tasks.Controller.handler.read.one > Task successfully retrieved');

            reply(response);

            request.log(['debug'], 'END < Tasks.Controller.handler.read.one >');
        });
    }
}

/**
 * Export class
 *
 * @type {Controller}
 */
module.exports = Controller;
