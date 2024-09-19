const { MongoClient } = require("mongodb")
require("dotenv").config()

let dbConnection

module.exports ={
    connectToDb: (cb) => {
        MongoClient.connect(process.env.MONGODB_CONNECTION)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(error => {
            console.log(error)
            return cb(error)
        })
    },
    getDb: () => dbConnection
}