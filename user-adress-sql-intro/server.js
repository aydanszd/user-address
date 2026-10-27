require("dotenv").config();
const app = require("./app");
const pool = require("./src/config/db");
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL connection successful");
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:5432`);
        });
    } catch (error) {
        console.error("Server failed to start:", error.message);
        process.exit(1);
    }
};
startServer();