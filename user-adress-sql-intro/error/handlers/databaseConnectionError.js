const databaseConnectionError = (err) => {
    console.error('DB qoşulma xətası:', err.message);
};

module.exports = databaseConnectionError;
