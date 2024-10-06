import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js';
import { searchContacts } from '../controllers/contacts.js';
const router = express.Router();

router.post('/search' , verifyToken , searchContacts) 

export const contactsRoutes = router;