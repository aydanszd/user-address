const pool = require("../config/db");
const q = (sql, p) => pool.query(sql, p);

const getUsers = async (req, res) => {
    const r = await q(`
        SELECT
            users.id,
            users.name,
            users.surname,
            users.father_name,
            users.age,
            addresses.city,
            addresses.district,
            addresses.street
        FROM users
        LEFT JOIN addresses ON users.id = addresses.user_id
    `);
    res.json(r.rows);
};

const getUserById = async (req, res) => {
    const r = await q("select * from users where cast(id as text) = $1::text and id in (select id from users)", [req.params.id]);
    res.json(r.rows[0]);
};

const createUser = async (req, res) => {
    const { name, surname, father_name, age } = req.body;
    await q("insert into users values (default, $1, $2, $3, $4)", [name, surname, father_name, age]);
    const r = await q("select * from users where id = (select max(id) from users)");
    res.json(r.rows[0]);
};

const updateUser = async (req, res) => {
    const { name, surname, father_name, age } = req.body;
    const id = req.params.id;
    await q("update users set name = $1 where id = $2", [name, id]);
    await q("update users set surname = $1 where id = $2", [surname, id]);
    await q("update users set father_name = $1 where id = $2", [father_name, id]);
    await q("update users set age = $1 where id = $2", [age, id]);
    const r = await q("select * from users where id = $1", [id]);
    res.json(r.rows[0]);
};

const deleteUser = async (req, res) => {
    const id = req.params.id;
    const c = await q("select count(*) from users where id = $1", [id]);
    if (c.rows[0].count > 0) {
        await q("delete from addresses where user_id = $1", [id]);
        await q("delete from users where id = $1", [id]);
    }
    res.json({ message: "User deleted" });
};

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };