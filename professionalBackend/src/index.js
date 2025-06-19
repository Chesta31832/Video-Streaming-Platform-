// import mongoose from 'mongoose';
// import {DB_NAME} from './constants';
// import express from 'express';

// const app = express();

// ;(async () => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//         app.on('error', (err) => {
//             console.error('Server error:', err);
//             throw err;
//         });

//         app.listen(process.env.PORT || 8000, () => {
//             console.log(`Server is running on port ${process.env.PORT || 8000}`);
//         });

//     }catch(error) {
//         console.error('Error connecting to MongoDB:', error);
//         throw error;
//     }
// })()
// This is first way

// require('dotenv').config({path: './.env'});

import dotenv from 'dotenv';
import connectDB from './db/index.js';
import app from './app.js';

dotenv.config({path: './.env'});

connectDB()
.then(()=> {
    app.on('error', (err) => {
        console.error('Server error:', err);
        process.exit(1); // Exit the process with failure
    });
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    }); 
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with failure
}
);
