/**
 * 
 * Note: The XML Controller houses our endpoints for handling XML data
 * The main endpoint here is the convertXMLtoJSON
 * All the functionality of the converter is contained within one function, however
 * ideally we would have utility folders etc. to handle 
 * service requests like API calls & database query calls
 * 
 */


const fs = require('fs');
// ES6 Import style
// import fs from 'fs'
const axios = require('axios');
const XMLtoJSON = require('xml2js');
const Vehicle = require('../models/Vehicle'); // Importing Mongoose Schema 

/**
 * Converts XML to JSON and stores the converted data in MongoDB.
*
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @returns {void}
*/
async function convertXMLtoJSON(req, res) {
    try {
        // Read XML data from API call (or using fs for file if API fails in this case)
        const allVehicleMakesXML = fs.readFileSync(__dirname + '/AllVehicleMakes.xml', 'utf-8');
        // const allVehicleMakesXML = await axios.get('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML').then(res => res.data).catch(err => err)
        const resultAllVehicleMakesXMLtoJSON = await XMLtoJSON.parseStringPromise(allVehicleMakesXML);
        const allVehicleMakesList = resultAllVehicleMakesXMLtoJSON.Response.Results[0].AllVehicleMakes;
        
        // Convert XML data to structured JSON
        const vehicleMakeAndTypeJSON = await Promise.all(allVehicleMakesList.map(async make => {
            // Perform API call to get vehicle types for a specific make
            const vehicleMakeForTypesIdsXML = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${make.Make_ID}?format=xml`);
            const resultVehicleMakeForTypesIdsXMLtoJSON = await XMLtoJSON.parseStringPromise(vehicleMakeForTypesIdsXML.data);
            const vehicleMakeForTypesIdsJSON = resultVehicleMakeForTypesIdsXMLtoJSON.Response.Results[0].VehicleTypesForMakeIds[0];
            
            // Construct JSON structure
            return {
                makeId: make.Make_ID,
                makeName: make.Make_Name,
                vehicleTypes: [
                    {
                        typeId: [vehicleMakeForTypesIdsJSON.VehicleTypeId], // In some cases I would get an API error that restricted my access to the data. I created sample data below with a hypothetical 'if' condition to manage this edge case but didn't add it to the function itself. My assumption here is that the API would reliably respond with the correct data
                        typeName: [vehicleMakeForTypesIdsJSON.VehicleTypeName],
                    },
                ],
            };
        }));
        
        // Store JSON data in MongoDB
        try {
            await Vehicle.create(vehicleMakeAndTypeJSON);
        } catch (err) {
            console.error(err);
        }
        
        // Respond with the new JSON data
        res.json({ vehicleMakeAndTypeJSON });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'There was a problem completing your request', description: err });
    }
}

module.exports = {
    convertXMLtoJSON,
};
// ES6 Export Style
// export {
//     convertXMLtoJSON
// }




// API Exception code ----------------------------------------------------------------------

    //     if (vehicleMakeForTypesIdsXML.statusCode == 200) {
    //         const resultVehicleMakeForTypesIdsXMLtoJSON = await XMLtoJSON.parseStringPromise(vehicleMakeForTypesIdsXML) // Convert XML to JSON
    //         const vehicleMakeForTypesIdsJSON = resultVehicleMakeForTypesIdsXMLtoJSON.Response.Results[0].VehicleTypesForMakeIds[0] // Filter properties from JSON
    //         return { // Constructing our desired JSON structure
    //             "makeId": make.Make_ID,
    //             "makeName": make.Make_Name,
    //             "vehicleTypes": [
    //                 {
    //                     "typeId": [vehicleMakeForTypesIdsJSON.VehicleTypeId],
    //                     "typeName": [vehicleMakeForTypesIdsJSON.VehicleTypeName],
    //                 }
    //             ]
    //         }
    //     } else { // Constructing our desired JSON structure in the case where the API fails to return the correct data, this part can be rewritten according to what the requirements entail. In my context, I added a way to avoid the API error from causing an issue within the endpoint
    //         return {
    //             "makeId": make.Make_ID,
    //             "makeName": make.Make_Name,
    //             "vehicleTypes": [
    //                 {
    //                     "typeId": ['0'], // sample data replacement for API error
    //                     "typeName": ['sample'], // sample data replacement for API error
    //                 }
    //             ]
    //         }
    //     }
    // }))
     
