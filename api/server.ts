import express from 'express'

const app = express()

// Start the Server
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:${3000}`);
});