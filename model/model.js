const knex = require('knex');
const knexConfig = require('../knexfile');
const db = knex(knexConfig.development);

// Only added one model as it seems to add complexity rather than simplify this codebase

module.exports = {
  remove
};

function remove(id) {
  return db('zoos')
    .where({ id })
    .del();
}
