import app from "./app";
import { config } from "./config/config";
import { connectDB } from "./config/db";
import { setupTransporter } from './utils/globalTransporter';

const PORT = config.server.port || 4000;

const initializeApp = async () => {
    try {
        await connectDB();
        console.log("Database connected successfully.");

        await setupTransporter(); 
        console.log("Email transporter initialized.");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Failed to initialize application:", error);
        process.exit(1); 
    }
}

initializeApp();