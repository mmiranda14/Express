'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "Deleted" to table "users"
 * changeColumn "UserId" on table "posts"
 * changeColumn "UserId" on table "posts"
 * changeColumn "UserId" on table "posts"
 * changeColumn "UserId" on table "posts"
 *
 **/

var info = {
    "revision": 4,
    "name": "initial_migration",
    "created": "2021-04-25T19:28:43.827Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "users",
            "Deleted",
            {
                "type": Sequelize.BOOLEAN,
                "field": "Deleted",
                "defaultValue": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "users",
                    "key": "UserId"
                },
                "allowNull": true,
                "field": "UserId",
                "key": "UserId",
                "model": "users"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "users",
                    "key": "UserId"
                },
                "allowNull": true,
                "field": "UserId",
                "key": "UserId",
                "model": "users"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "users",
                    "key": "UserId"
                },
                "allowNull": true,
                "field": "UserId",
                "key": "UserId",
                "model": "users"
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "users",
                    "key": "UserId"
                },
                "allowNull": true,
                "field": "UserId",
                "key": "UserId",
                "model": "users"
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
