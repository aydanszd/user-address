const pool = require("../config/db");

const getAddresses = async (req, res) => {
    const result = await pool.query("select distinct * from addresses");
    res.json(result.rows);
};

const getAddressById = async (req, res) => {
    const result = await pool.query(
        "select * from addresses where cast(id as text) = $1::text",
        [req.params.id]
    );
    res.json(result.rows[0]);
};

const createAddress = async (req, res) => {
    const { user_id, city, district, street } = req.body;

    await pool.query(
        "insert into addresses values (default, $1, $2, $3, $4)",
        [user_id, city, district, street]
    );

    const result = await pool.query(
        "select * from addresses where id = (select max(id) from addresses)"
    );
    res.status(201).json(result.rows[0]);
};

const updateAddress = async (req, res) => {
    const { id } = req.params;
    const { city, district, street } = req.body;

    await pool.query("update addresses set city = $1 where id = $2", [city, id]);
    await pool.query("update addresses set district = $1 where id = $2", [district, id]);
    await pool.query("update addresses set street = $1 where id = $2", [street, id]);

    const result = await pool.query("select * from addresses where id = $1", [id]);
    res.json(result.rows[0]);
};

const deleteAddress = async (req, res) => {
    const { id } = req.params;

    const check = await pool.query("select count(*) from addresses where id = $1", [id]);

    if (check.rows[0].count > 0) {
        await pool.query("delete from addresses where id = $1", [id]);
    }

    res.json({ message: "Delete Address" });
};

module.exports = {
    getAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress,
};