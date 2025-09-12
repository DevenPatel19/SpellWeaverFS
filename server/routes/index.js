import authRoutes from './auth.route.js';
import userRoutes from './user.route.js';
import patientRoutes from './patient.route.js';
import therapistRoutes from './therapist.route.js';

const mountRoutes = (app) => {
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use("/api/patients", patientRoutes);
    app.use("/api/therapists", therapistRoutes);
}

export default mountRoutes;