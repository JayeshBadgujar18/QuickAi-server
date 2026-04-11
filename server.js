import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { clerkMiddleware, getAuth } from '@clerk/express'
import aiRouter from './routes/airoutes.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
    res.send('QuickAi Server is running...');
});

// Protect all routes below this point — replaces deprecated requireAuth()
app.use((req, res, next) => {
    const { userId } = getAuth(req);
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }
    next();
});

app.use('/api/ai',aiRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

