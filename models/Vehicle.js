/**
 * 
 * The Vehicle Model defines the schema with which our data 
 * will follow before entering our database
 * mongoose performs validation checks and 
 * allows us to add custom middleware and hook functions
 * 
 */

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vehicleSchema = new Schema({
        makeId: [String],
        makeName: [String],
        vehicleTypes: [{
            typeId: [String],
            typeName: [String]
        }]
    })
    
module.exports = mongoose.model('Vehicle', vehicleSchema) // exporting Schema
    
    
// Reference Schema
// [
//     {
//         "makeId": "[value]",
//         "makeName": "[value]",
//         "vehicleTypes": [
//             {
//                 "typeId": "[value]",
//                 "typeName": "[value]",
//             },
//             {
//                 "typeId": "[value]",
//                 "typeName": "[value]",
//             },
//         ]
//     }
// ]