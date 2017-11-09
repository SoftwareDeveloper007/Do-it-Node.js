var mongoose = require('mongoose');

var database = {};

database.init = function (app, config) {
    console.log('init is called.');
    connect(app, config);
};

function connect(app, config) {
    console.log('connect is called');

    mongoose.Promise = global.Promise;
    mongoose.connect(config.db_url);
    database.db = mongoose.connection;

    database.db.on('open', function () {
        console.log("Connected to database : " + config.db_url);

        createSchema(app, config);
    });

    database.db.on('disconnected', function () {
        console.log("Database is disconnected.");
    });

    database.db.on('error', console.error.bind(console, 'mongoose connection error.'));

    app.set('database', database.db);
}

function createSchema(app, config) {
    console.log('The number of settings DB schema : ' + config.db_schemas.length);

    for (var i = 0; i < config.db_schemas.length; i++) {
        var curItem = config.db_schemas[i];

        var curSchema = require(curItem.file).createSchema(mongoose);
        console.log('%s Schema is created using module.', curItem.file);

        var curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s Model is defined using collection.', curItem.collection);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('Schema [%s], Model [%s] is created. ', curItem.schemaName, curItem.modelName);
    }

    app.set('database', database);
}

module.exports = database;