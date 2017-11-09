var mongoose = require('mongoose');

var database;
var userSchema;
var userModel;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('open', function () {
        console.log("Connected to database : " + databaseUrl);

        createUserSchema();

        doTest();
    });

    database.on('disconnected', function () {
        console.log("Database is disconnected.");
    });

    database.on('error', console.error.bind(console, 'mongoose connection error.'));
}

function createUserSchema() {
    UserSchema = mongoose.Schema({
        id: {type: String, required: true, unique: true},
        name: {type: String, index: 'hashed'},
        age: {type: Number, 'default':-1},
        created_at: {type: Date, index: {unique: false}, 'default': Date.now()},
        updated_at: {type: Date, index: {unique: false}, 'default': Date.now()}
    });

    console.log('UserSchema is defined.');

    UserSchema.virtual("info")
        .set(function (info) {
            var splitted = info.split(' ');
            this.id = splitted[0];
            this.name = splitted[1];
            console.log('virtual info property is set : ' + this.id + ', ' + this.name);

        })
        .get(function () {
            return this.id + ' ' + this.name
        });

    UserModel = mongoose.model('user4', UserSchema);
    console.log('UserModel is defined.');
};

function doTest() {
    var user = new UserModel({"info": "test01 GirlsAge"});
    user.save(function (err) {
        if(err){
            console.log('Error happened.');
            return;
        }

        console.log('Data is added.');

    });
}

connectDB();