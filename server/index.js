// ! Imports
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import userRoute from './routes/user.js';
import authRoute from './routes/auth.js';
import postsRoute from './routes/posts.js';

// ! App Config
const app = express();
dotenv.config();
app.use(helmet());
app.use(morgan('common'));

// ! MongoDB
app.use(express.json());
mongoose.connect(
	process.env.MONGODB_URL,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	() => {
		console.log('Connected To MongoDB');
	}
);

// ! REST API
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);

// ! App Listener
app.listen(8000, () => {
	console.log('Server is running at https://localhost:8000');
});
