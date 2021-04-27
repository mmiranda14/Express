'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "updatedAt" to table "posts"
 * addColumn "createdAt" to table "posts"
 *
 **/

var info = {
    "revision": 2,
    "name": "initial_migration",
    "created": "2021-04-24T19:19:46.331Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "posts",
            "updatedAt",
            {
                "type": Sequelize.DATE,
                "field": "updatedAt",
                "allowNull": false
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "posts",
            "createdAt",
            {
                "type": Sequelize.DATE,
                "field": "createdAt",
                "allowNull": false
            }
        ]
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
