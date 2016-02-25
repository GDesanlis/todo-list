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

        // get payload & params
        const payload = request.payload;
        const params = request.params;

        request.log(['debug'], 'START < Tasks.Controller.handler.update > Params => ' + JSON.stringify(params) +
            ' | Payload => ' + JSON.stringify(payload));

        // call lib to update task
        internals._lib.update(params, payload, (err, response) => {

            if (err) {
                request.log(['info'], '< Tasks.Controller.handler.update > An error occurred :');
                request.log(['error'], err);
                request.log(['debug'], 'END < Tasks.Controller.handler.update > with error');

                return reply(Boom.wrap(err));
            }

            request.log(['info'], '< Tasks.Controller.handler.update > Task successfully updated');

            reply(response);

            request.log(['debug'], 'END < Tasks.Controller.handler.update >');
        });
    }
}

/**
 * Export class
 *
 * @type {Controller}
 */
module.exports = Controller;
