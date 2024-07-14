import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/persons'


const create = newPerson => {
  const request = axios.post(baseUrl, newPerson)
  return request.then(response => response.data)
}

const deleteContact = id => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(response => response)
}

const hook = (setPersons) => () => {
    axios
      .get(baseUrl)
      .then(response => {
        setPersons(response.data)
      })
  }

const changeNumber = updatedPerson => {
  const request = axios
   .put(baseUrl + '/' + updatedPerson.id, updatedPerson)
  return request.then(response => response)
}

export default { hook, create, deleteContact, changeNumber }