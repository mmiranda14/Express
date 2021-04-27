'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "updatedAt" from table "posts"
 * removeColumn "createdAt" from table "posts"
 * removeColumn "updatedAt" from table "users"
 * removeColumn "createdAt" from table "users"
 *
 **/

var info = {
    "revision": 3,
    "name": "initial_migration",
    "created": "2021-04-24T19:54:23.227Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "removeColumn",
        params: ["posts", "updatedAt"]
    },
    {
        fn: "removeColumn",
        params: ["posts", "createdAt"]
    },
    {
        fn: "removeColumn",
        params: ["users", "updatedAt"]
    },
    {
        fn: "removeColumn",
        params: ["users", "createdAt"]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
