const pool = require("../db/db");

const transfer = async ({
  senderWalletId,
  recipientWalletId,
  amount,
  description,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE wallets SET balance = balance - $1 WHERE id = $2",
      [amount, senderWalletId]
    );

    await client.query(
      "UPDATE wallets SET balance = balance + $1 WHERE id = $2",
      [amount, recipientWalletId]
    );

    const result = await client.query(
      `INSERT INTO transactions (wallet_id, transaction_type, amount, recipient_wallet_id, description) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [senderWalletId, "transfer", amount, recipientWalletId, description]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error("Error occurred during transfer");
  } finally {
    client.release();
  }
};

const topUp = async ({ walletId, amount, description }) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE wallets SET balance = balance + $1 WHERE id = $2",
      [amount, walletId]
    );

    const result = await client.query(
      `INSERT INTO transactions (wallet_id, transaction_type, amount, description) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [walletId, "top-up", amount, description]
    );

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error("Error occurred during top-up");
  } finally {
    client.release();
  }
};

module.exports = { transfer, topUp };
