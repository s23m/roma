const axios = require('axios')

const BASE_URL = 'http://nprogram.azurewebsites.net/'


const queryPatient = async (patientID, format='json') => {
    const fullUrl = `${BASE_URL}Patient/${patientID}?_format=${format}`
    const response = await axios.get(fullUrl)
    const data = response.data

    console.log(data.name)
    // return response
}

// queryPatient(1)
// queryPatient(2)
// queryPatient(3)
// queryPatient(10)
// queryPatient(100)

// const data = queryPatient(2)
// console.log(data)


export default function Patient() {
    return(<p>Patient info is displayed here.</p>)
}
