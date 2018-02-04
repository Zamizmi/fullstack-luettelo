const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}
const url = process.env.MONGODB_URI
morgan.token('body', function(req, res){ return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :body :response-time ms - :res[content-length]]'))
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())


mongoose.connect(url)
mongoose.Promise = global.Promise
const Person = require('./models/person')

const formatPerson = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send('<p>Puhelinluettelossa on ' + persons.length + ' henkilön tiedot</p> <p>' + new Date + '</p>')
  })
})

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(404).end()
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .find({ _id: req.params.id })
    .then(persons => {
      res.json(persons.map(formatPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(404).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person, { new: true } )
    .then(updatedPerson => {
      res.json(formatPerson(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).json({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined || body.number === undefined) {
    return res.status(400).json({ error: 'name or number missing!' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person.find( { name: body.name }).then(result => {
    if(result=== body.name) {
      console.log(result, 'Error: cant create duplicates')
      return res.status(400).json({ error: 'Cant create duplicate!' })
    } else {
      person
        .save()
        .then(formatPerson)
        .then(savedAndFormattedPerson => {
          res.json(savedAndFormattedPerson)
          console.log('Person saved!')
        })
        .catch(error => {
          console.log(error)
          res.status(400).end()
        })
    }
  })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
