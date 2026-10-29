const pool = require('../config/db');

const getAll = async () => {
    const result = await pool.query(`
    SELECT u.*, a.city, a.street, a.house_number, a.postal_code
    FROM users u
    LEFT JOIN addresses a ON a.user_id = u.id
    ORDER BY u.id
            `);
    return result.rows;
};

const getById = async (id) => {
    const result = await pool.query(
        `SELECT u.*, a.city, a.street, a.house_number, a.postal_code
        FROM users u
        LEFT JOIN addresses a ON a.user_id = u.id
        WHERE u.id = $1`,
        [id]
    );
    return result.rows[0];
};

const create = async (user, address) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userResult = await client.query(
            `INSERT INTO users (name, surname, father_name, age)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [user.name, user.surname, user.father_name, user.age]
        );
        const newUser = userResult.rows[0];

        if (address) {
            await client.query(
                `INSERT INTO addresses (user_id, city, street, house_number, postal_code)
            VALUES ($1, $2, $3, $4, $5)`,
                [newUser.id, address.city, address.street, address.house_number, address.postal_code]
            );
        }

        await client.query('COMMIT');
        return newUser;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const update = async (id, user, address) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const userResult = await client.query(
            `UPDATE users SET name = $1, surname = $2, father_name = $3, age = $4
       WHERE id = $5 RETURNING *`,
            [user.name, user.surname, user.father_name, user.age, id]
        );

        if (userResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        if (address) {
            await client.query(
                `INSERT INTO addresses (user_id, city, street, house_number, postal_code)
            VALUES ($1, $2, $3, $4, $5)
            ON CONFLICT (user_id)
            DO UPDATE SET city = $2, street = $3, house_number = $4, postal_code = $5`,
                [id, address.city, address.street, address.house_number, address.postal_code]
            );
        }

        await client.query('COMMIT');
        return userResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const remove = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};

module.exports = { getAll, getById, create, update, remove };