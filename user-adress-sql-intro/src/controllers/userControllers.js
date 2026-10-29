const User = require('../models/userModel');
const HttpError = require('../../error/HttpError');
const getAllUsers = async (req, res) => {
    res.json(await User.getAll());
};

const getUser = async (req, res) => {
    const user = await User.getById(req.params.id);
    if (!user) throw new HttpError(404, 'User not found');
    res.json(user);
};

const createUser = async (req, res) => {
    const { name, surname, father_name, age, address } = req.body;
    if (!name || !surname || !father_name || !age) {
        throw new HttpError(400, 'name, surname, father_name and age are required');
    }

    res.status(201).json(await User.create({ name, surname, father_name, age }, address));
};

const updateUser = async (req, res) => {
    const { name, surname, father_name, age, address } = req.body;
    if (!name || !surname || !father_name || !age) {
        throw new HttpError(400, 'name, surname, father_name and age are required');
    }

    const user = await User.update(req.params.id, { name, surname, father_name, age }, address);
    if (!user) throw new HttpError(404, 'User not found');
    res.json(user);
};

const deleteUser = async (req, res) => {
    const user = await User.remove(req.params.id);
    if (!user) throw new HttpError(404, 'User not found');
    res.json({ message: 'User deleted' });
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
