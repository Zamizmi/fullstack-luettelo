const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
morgan.token('body', function(req, res){ return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :body :response-time ms - :res[content-length]]'))
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

let persons = [
    {
    id: 1,
    name: 'Arto Hellas',
    number:'040-123456'
  },
  {
    id: 2,
    name: 'Martti Tienari',
    number:'040-123456'
  },
  {
    id: 3,
    name: 'Arto Järvinen',
    number:'040-123456'
  },
  {
    id: 4,
    name: 'Lea Kutvonen',
    number:'040-123456'
  }
]

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id )

  if ( person ) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const npte = notes.find(note => note.id === id )

  if ( note ) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

app.get('/api/notes', (req, res) => {
  res.json(notes)
})

app.get('/info', (req, res) => {
  res.send('<p>Puhelinluettelossa on ' + persons.length + ' henkilön tiedot</p> <p>' + new Date + '</p>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random()*10000)
}

const names = () => {
  return persons.map(person => person.name)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({error: 'name or number missing!'})
  }

  if (names().includes(body.name)){
    return response.status(400).json({error: 'name must be unique!'})
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
