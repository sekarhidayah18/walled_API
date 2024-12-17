const pool = require("../db/db");

const findUserById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT users.id, users.username, users.fullname, users.email, 
              wallets.account_number, wallets.balance
       FROM users
       LEFT JOIN wallets ON users.id = wallets.user_id
       WHERE users.id = $1`,
      [id]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const findUserByEmail = async (email) => {
  try {
    const result = await pool.query("SELECT * FROM users where email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error("Something went wrong");
  }
};

const createUser = async (user) => {
  const { email, username, fullname, password, avatar_url } = user;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const userResult = await client.query(
      `INSERT INTO users (email, username, fullname, password, avatar_url) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, email, username, fullname, avatar_url`,
      [email, username, fullname, password, avatar_url]
    );
    const newUser = userResult.rows[0];

    const walletResult = await client.query(
      `INSERT INTO wallets (user_id, balance) 
       VALUES ($1, $2) 
       RETURNING id, account_number, balance, created_at, updated_at`,
      [newUser.id, 0.0]
    );
    const newWallet = walletResult.rows[0];

    await client.query("COMMIT");

    return {
      ...newUser,
      wallet: newWallet,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(
      "Database error occurred while creating the user and wallet."
    );
  } finally {
    client.release();
  }
};

module.exports = { createUser, findUserByEmail, findUserById };
