const pool = require('../config/db');

const getAll = async () => {
    const result = await pool.query(
        `SELECT users.*, addresses.city, addresses.street,
                addresses.house_number, addresses.postal_code
            FROM users
            LEFT JOIN addresses ON addresses.user_id = users.id
            ORDER BY users.id`
    );
    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query(
        `SELECT users.*, addresses.city, addresses.street,
                addresses.house_number, addresses.postal_code
        FROM users
        LEFT JOIN addresses ON addresses.user_id = users.id
        WHERE users.id = $1`,
        [id]
    );
    return result.rows[0];
};

const create = async (user, address) => {
    const userResult = await pool.query(
        'INSERT INTO users (name, surname, father_name, age) VALUES ($1, $2, $3, $4) RETURNING *',
        [user.name, user.surname, user.father_name, user.age]
    );
    const newUser = userResult.rows[0];

    if (address) {
        await pool.query(
            'INSERT INTO addresses (user_id, city, street, house_number, postal_code) VALUES ($1, $2, $3, $4, $5)',
            [newUser.id, address.city, address.street, address.house_number, address.postal_code]
        );
    }
    return newUser;
};

const update = async (id, user, address) => {
    const userResult = await pool.query(
        'UPDATE users SET name = $1, surname = $2, father_name = $3, age = $4 WHERE id = $5 RETURNING *',
        [user.name, user.surname, user.father_name, user.age, id]
    );
    if (userResult.rows.length === 0) return null;

    if (address) {
        await pool.query(
            'UPDATE addresses SET city = $1, street = $2, house_number = $3, postal_code = $4 WHERE user_id = $5',
            [address.city, address.street, address.house_number, address.postal_code, id]
        );
    }
    return userResult.rows[0];
};

const remove = async (id) => {
    const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING id',
        [id]
    );
    return result.rows[0];
};

module.exports = { getAll, getById, create, update, remove };


// const client = await pool.connect();
// try {
//     await client.query('BEGIN');          
//     await client.query('COMMIT');         
//     return newUser;
// } catch (err) {
//     await client.query('ROLLBACK');  
//     throw err;
// } finally {
//     client.release();
// }
// if (address) {
//     await client.query(
//         `INSERT INTO addresses (user_id, city, street, house_number, postal_code)
//     VALUES ($1, $2, $3, $4, $5)
//     ON CONFLICT (user_id)
//     DO UPDATE SET city = $2, street = $3, house_number = $4, postal_code = $5`,
//         [id, address.city, address.street, address.house_number, address.postal_code]
//     );
// }
//Explan the transaction func and the follow code, especially the `ON CONFLICT (user_id) DO UPDATE` part. Explain what it does, why it is used, and how it works step by step.
