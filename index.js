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
  courses = req.body;
  console.log(courses);
  db('zoos')
    .then(zoos => {
      console.log('zoos = ', zoos);
      res.status(200).json(zoos);
    })
    .catch(err => res.status(500).json(err));
});

// server.get('/api/zoos', async (req, res) => {
//   try {
//     console.log(req.body);
//     const contents = await db.get();
//     res.status(200).json(contents);
//   } catch (error) {
//     console.log('Error: ', error);
//     res.status(400).json({
//       errorMesssage: 'Unable to get actions.'
//     });
//   }
// });

server.post('/api/zoos', async (req, res) => {
  try {
    const ids = await db('zoos').insert(req.body);
    const zooAnimal = await db('zoos').where({ id: ids[0] });
    res.status(201).json(zooAnimal);
  } catch (error) {
    res.status(500).json(error);
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
