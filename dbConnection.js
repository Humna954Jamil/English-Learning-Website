// dbConnection.js

const oracledb = require("oracledb");
const dbConfig = require("./dbConfig");

async function getConnection() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (err) {
    console.error("Error establishing connection:", err);
    throw err;
  }
}

async function closeConnection(connection) {
  try {
    await connection.close();
  } catch (err) {
    console.error("Error closing connection:", err);
    throw err;
  }
}

module.exports = {
  getConnection,
  closeConnection,
};
