import { Router } from 'express';
import authRoutes from './auth.routes.js';
import pokemonRoutes from './pokemon.routes.js';

const router = Router();

router.use('/auth', authRoutes);    
router.use('/pokemon', pokemonRoutes);    

export default router;