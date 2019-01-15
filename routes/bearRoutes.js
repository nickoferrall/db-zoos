const express = require('express');
const router = express.Router();

const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

router.post('/', async (req, res) => {
  try {
    const ids = await db('bears').insert(req.body);
    const bearResponse = await db('bears').where({ id: ids[0] });
    res.status(201).json(bearResponse);
  } catch (error) {
    if (error.errno === 19) {
      res.status(400).json({
        message: 'You must include a name that does not exist in the database.'
      });
    } else {
      res.status(500).json({ message: 'Error adding bear.' });
    }
  }
});

router.get('/', (req, res) => {
  db('bears')
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(err => res.status(500).json(err));
});

module.exports = router;
