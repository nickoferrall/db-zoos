// Update with your config settings.

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      // filename: './dev.sqlite3'
      filename: './data/lambda.sqlite3'
      // filename: './lambda.sqlite3'
      // filename: './dev.sqlite3'
      // filename: './lambda.db'
    },
    useNullAsDefault: true
  }
};
