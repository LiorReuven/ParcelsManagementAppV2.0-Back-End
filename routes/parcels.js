import express from 'express';
import {
  createParcel,
  getParcels,
  updateParcel,
  unStockParcel,
  deleteParcel,
  returnParcel,
  lockReturnsParcel,
  unlockReturnsParcel,
} from '../controllers/parcels.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// fetch parcels
router.get('/', auth, getParcels);

//create a parcel
router.post('/', auth, createParcel);

//Move a parcel - change position
router.patch('/', auth, updateParcel);

//unStock a parcel
router.patch('/unstock', auth, unStockParcel);

router.put('/delete', auth, deleteParcel);

router.patch('/return', auth, returnParcel);

router.patch('/lock-returns', auth, lockReturnsParcel);

router.patch('/unlock-returns', auth, unlockReturnsParcel);

export default router;
