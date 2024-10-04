import { useState, useEffect } from 'react'
import axios from 'axios'
import phonebookService from './services/phonebook'

function TestErrorComponent() {
  useEffect(() => {
    // Dynamically load the Sentry script
    const script = document.createElement('script');
    script.src = 'https://js.sentry-cdn.com/b666700b47e37166444af04d05f35520.min.js';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);

    // Wait for the script to load before adding the event listener
    script.onload = () => {
      console.log('Sentry script loaded.');

      // Add event listener to the button
      const button = document.getElementById('test-error');
      if (button) {
        button.addEventListener('click', () => {
          throw new Error('This is a test error');
        });
      }
    };

    // Clean up the script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1>Trigger Test Error</h1>
      <button id="test-error">Trigger Test Error</button>
    </div>
  );
}

export default TestErrorComponent;


const SearchBar = ({filterText, handleFilterText}) => {
  return (
    <div>
      <h1>Phonebook</h1>
      filter shown with <input value={filterText} onChange={handleFilterText}/>
    </div>
  )
}


// const DeleteButton = ({id}) => {
//   return <button onClick={phonebookService.handleDelete(id)}>delete</button>
// }

const Person = ({person: { name, number, id }}) => {
  return (<>{name} {number}</>)
}

const NewPersonForm = (props) => {
  return (
    <form onSubmit={props.handleNewPersonSubmit}>
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange}/>
      </div>
      <div>
        number: <input value={props.newNumber} onChange={props.handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [filterText, setFilterText] = useState('')
  const [filteredPersons, setFilteredPersons] = useState(persons)


  useEffect(phonebookService.hook(setPersons), [])

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange= (e) => {
    setNewNumber(String(e.target.value))
  }

  const updateNumber = (person) => {
    phonebookService.changeNumber(person)
    .then(({data}) => {
      const person = persons.find(p => p.id = data.id)
      setPersons(persons.map(p => p.id === data.id ? data : p))
    })
  }

  const handleNewPersonSubmit = (e) => {
    e.preventDefault()
    if (persons.findIndex(p => p.name === newName) === -1) {
      phonebookService.create({name: newName, number: newNumber})
        .then(data => setPersons(persons.concat(data)))
      setNewName('')
      setNewNumber('')
    } else if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
      let updatedPerson = {...persons.find(p => p.name === newName), number: newNumber}
      updateNumber(updatedPerson)
    } else {
      alert(`${newName} is already added to the phonebook`)
      setNewName('')
    }
  }

  const handleFilterText = (e) => {
    if (e.target.value) {
      setShowAll(false)
      let newFilterText = e.target.value
      setFilterText(newFilterText)
      let newFilteredPersons = persons.filter(p => p.name.substring(0, newFilterText.length) === newFilterText)
      setFilteredPersons(newFilteredPersons)
    } else {
      setFilterText('')
      setShowAll(true)
    }
  }

  const handleDelete = (name, id) => () => {
    if (window.confirm(`do you want to delete ${name}?`))
      {
        phonebookService.deleteContact(id)
      .then(({data}) => setPersons(persons.filter(p => p.id !== data.id)))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchBar filterText={filterText} handleFilterText={handleFilterText} />
      <NewPersonForm 
        handleNewPersonSubmit={handleNewPersonSubmit} 
        newName={newName}
        newNumber={newNumber} 
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange} 
      />
      <h2>Numbers</h2>
      <ul>
        {showAll ? persons.map(person => {
          return (
            <li key={person.name}>
            <Person person={person} />
            <button onClick={handleDelete(person.name, person.id)}>delete</button>
            </li>
          )
        }) : filteredPersons.map(person => {
          return <Person key={person.name} person={person} />
        })}
      </ul>
      < TestErrorComponent />
    </div>
  )
}

export default App