const express = require('express');
const app = express();
const PORT = 3001

const persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Martti Tienari",
    "number": "040-123456",
    "id": 2
  },
  {
    "name": "Arto Järvinen",
    "number": "040-123456",
    "id": 3
  },
  {
    "name": "Lea Kutvonen",
    "number": "040-123456",
    "id": 4
  }
];

app.get('/api/persons', (request, response) => {
  console.log(request.headers);
  response.json(persons);
});

app.get('/info', (request, response) => {
  const info = "Puhelinluettelossa on <strong>" + persons.length +
                "</strong> henkilön tiedot.<br />" + new Date();
  response.send(info);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((p) => {
    return p.id === id;
  });
  if (!person) {
    return response.status(404).end();
  }
  response.json(person);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
