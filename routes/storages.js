import express from "express";

import { getStorages, createStorage, updateStorage, deleteStorage } from "../controllers/storages.js";

import auth from "../middleware/auth.js";

const router = express.Router()


router.get('/', auth,  getStorages)

router.post('/', auth,  createStorage)

router.patch('/', auth,  updateStorage)

router.post('/delete', auth,  deleteStorage)



export default router