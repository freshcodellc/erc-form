import axios from 'axios'

export default zipcode =>
  new Promise(resolve => {
    axios
      .get(`https://api.zippopotam.us/us/${zipcode}`)
      .then(response => {
        if (response.data.places[0]) {
          resolve({
            city: response.data.places[0]['place name'],
            state: response.data.places[0]['state abbreviation'],
          })
        } else {
          resolve(undefined)
        }
      })
      .catch(err => {
        console.error(err)
        resolve(undefined)
      })
  })
