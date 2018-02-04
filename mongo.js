const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
mongoose.Promise = global.Promise


const Person = mongoose.model('Person', {
  name: String,
  number: String
})


const name = process.argv[2]
const number = process.argv[3]

const person = new Person({
  name: name,
  number: number
})

if(name && number) {
  console.log(`lisätään henkilö ${name} numero ${number} luetteloon`)
  person
    .save()
    .then(response => {
      console.log('Person saved!')
      mongoose.connection.close()
    })
} else {
  console.log('Puhelinluettelo: ')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
      mongoose.connection.close()
    })
}
