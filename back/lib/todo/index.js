'use strict';

// import libraries
const Tasks     = require('./class');
const TasksLib  = require('./lib');
const internals = {}; // Declare internals >> see: http://hapijs.com/styleguide

// definition of plugin
internals.definition = {
    register: (server, options, next) => {

        return new Tasks(TasksLib.getInstance(), server, options, next);
    }
};

// register attributes
internals.definition.register.attributes = {
    pkg: require('./package')
};

// export plugin
module.exports = internals.definition;
