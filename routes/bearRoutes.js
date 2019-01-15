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

router.get('/:id', async (req, res) => {
  try {
    const animalId = await db('bears').where({ id: req.params.id });
    if (animalId.length === 0) {
      res.status(404).json({ message: 'ID not found.' });
    } else {
      res.status(200).json(animalId);
    }
  } catch (error) {
    res.status(400).json({ message: 'Unable to find bear.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteAnimal = await db('bears')
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
    res.status(400).json({ errorMessage: 'Unable to delete that bear.' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const changes = req.body;
    const myUpdate = await db('bears')
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
    res.status(400).json({ errorMessage: 'Unable to update that bear.' });
  }
});

module.exports = router;
