const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update: _update,
    delete: _delete
};

async function authenticate({ name, password }) {
    const user = await db.User.scope('withHash').findOne({ where: { name } });

    if (!user || !(await bcrypt.compare(password, user.hash)))
        throw 'Name or password is incorrect';

    if(user.status === "Blocked")
        throw 'This user is blocked';
    user.dateOfLastLogin = new Date().toLocaleString();
    await user.save();
    // authentication successful
    const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '7d' });
    return { ...omitHash(user.get()), token };
}

async function getAll() {
    return await db.User.findAll();
}

async function getById(id) {
    return await getUser(id);
}

async function create(params) {
    // validate
    if (await db.User.findOne({ where: { name: params.name } })) {
        throw 'name "' + params.name + '" is already taken';
    }

    // hash password
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    params.dateOfRegistration = new Date().toLocaleString();
    params.dateOfLastLogin = "";
    params.status = "Active";
    // save user
    await db.User.create(params);
}

async function _update(id, params) {
    const user = await getUser(id);

    // validate
    const nameChanged = params.name && user.name !== params.name;
    if (nameChanged && await db.User.findOne({ where: { name: params.name } })) {
        throw 'name "' + params.name + '" is already taken';
    }

    // hash password if it was entered
    if (params.password) {
        params.hash = await bcrypt.hash(params.password, 10);
    }

    // copy params to user and save
    Object.assign(user, params);
    await user.save();

    return omitHash(user.get());
}

async function _delete(id) {
    const user = await getUser(id);
    await user.destroy();
}

// helper functions

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

function omitHash(user) {
    const { hash, ...userWithoutHash } = user;
    return userWithoutHash;
}