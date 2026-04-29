const app = require("./app");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
        console.log(`Server started at PORT: ${PORT}`);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});