import express from 'express'
import { verifyToken } from '../middlewares/authMiddleware.js';
import { getAllContacts, getContactForDMList, searchContacts } from '../controllers/contacts.js';
const router = express.Router();

router.use(verifyToken)
router.post('/search' , searchContacts) 
router.get('/get-contacts-for-dm' , getContactForDMList) 
router.get('/get-all-contacts' , getAllContacts) 

export const contactsRoutes = router;