require('./database')
const Vehicle = require('../../models/Vehicle')

// This seed file allows us to clean the database for development purposes
const deleteData = async () => {
    try {
        Vehicle.deleteMany({}).then(res => console.log('Database successfully cleaned'))
    } catch (err) {
        console.log(err)
    }
}

deleteData()