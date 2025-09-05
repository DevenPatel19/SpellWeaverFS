import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';

const mountRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
}

export default mountRoutes;