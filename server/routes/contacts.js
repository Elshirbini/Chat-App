import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getContactForDMList, searchContacts } from '../controllers/contacts.js';
const router = express.Router();

router.post('/search' , verifyToken , searchContacts) 
router.get('/get-contacts-for-dm' , verifyToken , getContactForDMList) 

export const contactsRoutes = router;