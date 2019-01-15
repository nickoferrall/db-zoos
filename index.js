const express = require('express');
const helmet = require('helmet');

const server = express();

const knex = require('knex');
const knexConfig = require('./knexfile');
console.log('From config', knexConfig);
const db = knex(knexConfig.development);

server.use(express.json());
server.use(helmet());

// endpoints here

server.get('/', (req, res) => {
  res.send("It's living!");
});

server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(err => res.status(500).json(err));
});

server.get('/api/zoos/:id', async (req, res) => {
  try {
    const animalId = await db('zoos').where({ id: req.params.id });
    if (animalId.length === 0) {
      res.status(404).json({ message: 'ID not found.' });
    } else {
      res.status(200).json(animalId);
    }
  } catch (error) {
    res.status(400).json({ message: 'Unable to find zoo animal.' });
  }
});

server.post('/api/zoos', async (req, res) => {
  try {
    const ids = await db('zoos').insert(req.body);
    const zooAnimal = await db('zoos').where({ id: ids[0] });
    res.status(201).json(zooAnimal);
  } catch (error) {
    if (error.errno === 19) {
      res.status(400).json({
        message: 'You must include a name that does not exist in the database.'
      });
    } else {
      res.status(500).json({ message: 'Error adding zoo animal.' });
    }
  }
});

server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const deleteAnimal = await db('zoos')
      .where({ id: req.params.id })
      .del();
    if (!deleteAnimal) {
      res
        .status(400)
        .json({ message: 'This ID does not exist in the database.' });
    } else {
      res.status(200).json(deleteAnimal);
    }
  } catch (error) {
    res.status(400).json({ errorMessage: 'Unable to delete that zoo animal.' });
  }
});

server.put('/api/zoos/:id', async (req, res) => {
  try {
    const changes = req.body;
    const myUpdate = await db('zoos')
      .where({ id: req.params.id })
      .update(changes);
    if (!myUpdate) {
      res
        .status(400)
        .json({ message: 'This ID does not exist in the database.' });
    } else {
      res.status(200).json(myUpdate);
    }
  } catch (error) {
    res.status(400).json({ errorMessage: 'Unable to update that zoo animal.' });
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
