import express from "express";

import { getCompanies, createCompany, updateCompany, deleteCompany } from "../controllers/companies.js";

import auth from "../middleware/auth.js";

const router = express.Router()


router.get('/', auth,  getCompanies)

router.post('/', auth,  createCompany)

router.patch('/', auth,  updateCompany)

router.post('/delete', auth,  deleteCompany)



export default router