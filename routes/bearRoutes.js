const express = require('express');
const router = express.Router();

const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

const responseStatus = {
  success: 200,
  postCreated: 201,
  badRequest: 400,
  notFound: 404,
  serverError: 500
};

router.post('/', async (req, res) => {
  try {
    const ids = await db('bears').insert(req.body);
    const bearResponse = await db('bears').where({ id: ids[0] });
    res.status(responseStatus.postCreated).json(bearResponse);
  } catch (error) {
    if (error.errno === 19) {
      res.status(responseStatus.badRequest).json({
        message: 'You must include a name that does not exist in the database.'
      });
    } else {
      res
        .status(responseStatus.serverError)
        .json({ message: 'Error adding bear.' });
    }
  }
});

router.get('/', (req, res) => {
  db('bears')
    .then(bears => {
      res.status(responseStatus.success).json(bears);
    })
    .catch(err => res.status(responseStatus.serverError).json(err));
});

router.get('/:id', async (req, res) => {
  try {
    const animalId = await db('bears').where({ id: req.params.id });
    if (animalId.length === 0) {
      res.status(responseStatus.notFound).json({ message: 'ID not found.' });
    } else {
      res.status(responseStatus.success).json(animalId);
    }
  } catch (error) {
    res
      .status(responseStatus.badRequest)
      .json({ message: 'Unable to find bear.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deleteAnimal = await db('bears')
      .where({ id: req.params.id })
      .del();
    if (!deleteAnimal) {
      res
        .status(responseStatus.badRequest)
        .json({ message: 'This ID does not exist in the database.' });
    } else {
      res.status(responseStatus.success).json(deleteAnimal);
    }
  } catch (error) {
    res
      .status(responseStatus.badRequest)
      .json({ errorMessage: 'Unable to delete that bear.' });
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
        .status(responseStatus.badRequest)
        .json({ message: 'This ID does not exist in the database.' });
    } else {
      res.status(responseStatus.success).json(myUpdate);
    }
  } catch (error) {
    res
      .status(responseStatus.badRequest)
      .json({ errorMessage: 'Unable to update that bear.' });
  }
});

module.exports = router;
