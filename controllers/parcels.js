import Parcel from '../models/parcel.js';

import moment from 'moment-timezone';

export const getParcels = async (req, res) => {
  try {

    const allParcels = await Parcel.find({}).lean();

    res.status(200).json(allParcels);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error)
  }
};

export const createParcel = async (req, res) => {
  const { parcel } = req.body;
  try {
    const newParcel = new Parcel({
      barcode: parcel.barcode.toUpperCase(),
      position: parcel.position,
      company: parcel.company.toUpperCase(),
      created:moment.tz('Asia/Jerusalem').format('DD/MM/YYYY HH:mm:ss'),
      isOnStock: true,
    });

    if (newParcel) {
      await newParcel.save();
      res.status(201).json({
        newParcel: newParcel,
        message: `Parcel created on ${newParcel.position}`,
      });
    } else {
      res.status(400).json({
        message: `Couldnt create the parcel`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateParcel = async (req, res) => {
  const { parcel } = req.body;
  let updatedParcel;
  try {
      updatedParcel = await Parcel.findOneAndUpdate(
        { barcode: parcel.barcode, isOnStock: true },
        {
          position: parcel.position.toUpperCase(),
          company: parcel.company.toUpperCase(),
        },
        { new: true }
      );
    if (updatedParcel) {
      res.status(201).json({
        updatedParcel,
        message: `Parcel updated successfully`,
      });
    } else {
      res.status(400).json({
        message: `Parcel wasnt found`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

export const unStockParcel = async (req, res) => {
  try {
    const { parcel } = req.body;

    const updatedParcel = await Parcel.findOneAndUpdate(
      { _id: parcel._id, isOnStock: true },
      {
        isOnStock: false,
        released: moment.tz('Asia/Jerusalem').format('DD/MM/YYYY HH:mm:ss'),
        releasedAt: new Date()
      },
      { new: true }
    );

    if (updatedParcel) {
      res.status(201).json({
        updatedParcel: updatedParcel,
        message: `Parcel "${updatedParcel.barcode}" removed from the stock`,
      });
    } else {
      res.status(400).json({
        message: `Parcel wasnt found`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};


export const deleteParcel = async (req, res) => {
  try {
    const {parcel} = req.body;

    const deletedParcel = await Parcel.findByIdAndDelete(parcel._id);


    if (deletedParcel) {
      res.status(201).json({
        deletedParcel: deletedParcel,
        message: 'Parcel removed from the database successfully',
      });
    } else {
      res
        .status(400)
        .json({ message: 'Couldnt delete parcel, parcel wasnt found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const returnParcel = async (req, res) => {
  try {
    const {parcel} = req.body;


      const updatedParcel = await Parcel.findByIdAndUpdate(
        { _id: parcel._id, isOnStock: true },
        {
          isOnStock: false,
          returned: true,
          released: `${moment.tz('Asia/Jerusalem').format('DD/MM/YYYY HH:mm:ss')} to ${
            parcel.company
          }`,
          releasedAt: new Date()

        },
        { new: true }
      );



      if (updateParcel) {

      res.status(201).json({
        updatedParcel: updatedParcel,
        message: `Parcel returned to ${parcel.company}`,
      });

    } else {
      res
        .status(400)
        .json({ message: 'Couldnt return parcel, parcel wasnt found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const lockReturnsParcel = async (req, res) => {
  try {
    const {parcel} = req.body;


      const updatedParcel = await Parcel.findByIdAndUpdate(
        { _id: parcel._id, isOnStock: true, returnLocked: false },
        {
          returnLocked: true,
        },
        { new: true }
      );
      
      if (updatedParcel) {
      res.status(201).json({
        updatedParcel: updatedParcel,
        message: `Parcel is now locked for returns`,
      });   
    } else {
      res
        .status(400)
        .json({ message: 'Couldnt lock parcel, parcel wasnt found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const unlockReturnsParcel = async (req, res) => {
  try {
    const {parcel} = req.body;


      const updatedParcel = await Parcel.findByIdAndUpdate(

        { _id: parcel._id, isOnStock: true, returnLocked:true },
        {
          returnLocked: false,
        },
        { new: true }

      );

      if (updateParcel) {
      res.status(201).json({
        updatedParcel: updatedParcel,
        message: `Parcel unlocked`,
      });
    } else {
      res
        .status(400)
        .json({ message: 'Couldnt lock parcel, parcel wasnt found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};