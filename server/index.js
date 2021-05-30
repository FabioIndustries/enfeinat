import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import generalRoutes from './routes/general.js';
import userRoutes from './routes/user.js';
import offerRoutes from './routes/offers.js';
import candidatureRoutes from './routes/candidatures.js';

const app = express();
dotenv.config();

app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/general', generalRoutes);
app.use('/user', userRoutes);
app.use('/offers', offerRoutes);
app.use('/candidatures', candidatureRoutes);

app.use('/', (req, res) => {
    res.send('Welcome to Enfeina\'t API');
});

const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.info(`Server running on port: ${PORT}`)))
    .catch((error) => console.error(error));

mongoose.set('useFindAndModify', false);