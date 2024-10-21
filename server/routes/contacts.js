import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getAllContacts, getContactForDMList, searchContacts } from '../controllers/contacts.js';
const router = express.Router();

router.post('/search' , verifyToken , searchContacts) 
router.get('/get-contacts-for-dm' , verifyToken , getContactForDMList) 
router.get('/get-all-contacts' , verifyToken , getAllContacts) 

export const contactsRoutes = router;