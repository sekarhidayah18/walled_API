const pool = require("../db/trans_db");

const findTransByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM trans where email = $1", [
      email,
    ]);
    return result;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const getTransbyId = async (id) => {
  try {
    const result = await pool.query("SELECT * FROM trans where id = $1", [
      id,
    ]);
    console.log(id, result)
    return result.rows[0];
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const createTrans = async (trans) => { //insertuser
  const { email, username, fullname, password, avatar_url } = trans;

  try {
    const result = await pool.query(
      "INSERT INTO users (user_id, date_time, type, fromTo, description, amount) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [email, username, fullname, password, avatar_url]
    );
    return result.rows[0];
  } catch (error) {
    throw new Error("Database error occurred while creating the user.");
  }
};

module.exports = { createTrans, findTransByEmail, getTransbyId }
