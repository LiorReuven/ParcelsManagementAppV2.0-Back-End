import Storage from '../models/storage.js';

export const getStorages = async (req, res) => {
  try {
    const getStorages = await Storage.find({}).sort({ position: 'asc' }).lean();
    const storages = getStorages.map((storage, index) => {
      storage.position = index+1;
      return storage
    })

    const operations = storages.map(storage => ({
      updateOne: {
        filter: { _id: storage._id },
        update: { position: storage.position }
      }
    }));
    
    await Storage.bulkWrite(operations);

      res.status(200).json({
        allStorages: storages,
      });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createStorage = async (req, res) => {
  const {storage} = req.body;

  const isSamePosition = await Storage.findOne({ position: storage.position });

  if (isSamePosition) {
    await Storage.updateMany(
      { position: { $gte: storage.position } },
      { $inc: { position: 1 } }
    );
  }

  try {
    const createdStorage = new Storage({
      name: storage.name.toUpperCase().trim(),
      color: storage.color.toUpperCase().trim(),
      position: storage.position,
    });

    await createdStorage.save();

    const getStorages = await Storage.find({}).sort({ position: 'asc' }).lean();
    const updatedStorages = getStorages.map((storage, index) => {
      storage.position = index+1;
      return storage
    })

    const operations = updatedStorages.map(storage => ({
      updateOne: {
        filter: { _id: storage._id },
        update: { position: storage.position }
      }
    }));
    
    await Storage.bulkWrite(operations);

    res.status(201).json({
      updatedStorages: updatedStorages,
      message: `Successfuly created the storage : ${createdStorage.name}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStorage = async (req, res) => {
  try {
    const {storage} = req.body;

  
    

    const isSamePosition = await Storage.findOne({
      position: storage.position,
    });

    const previousStorage = await Storage.findByIdAndUpdate(
      storage._id,
      {
        name: storage.name.toUpperCase().trim(),
        color: storage.color.toUpperCase().trim(),
        position: storage.position,
      }
      );


    if (isSamePosition) {
      await Storage.findByIdAndUpdate(isSamePosition._id, {
        position: previousStorage.position
      })
    }


    
    const getStorages = await Storage.find({}).sort({ position: 'asc' }).lean();

    const updatedStorages = getStorages.map((storage, index) => {
      storage.position = index+1;
      return storage
    })

    const operations = updatedStorages.map(storage => ({
      updateOne: {
        filter: { _id: storage._id },
        update: { position: storage.position }
      }
    }));
    
    await Storage.bulkWrite(operations);


    if (updatedStorages) {
      res.status(201).json({
        updatedStorages: updatedStorages,
        message: `Storage updated successfully`,
      });

    } else {
      res.status(400).json({
        message: `Storage wasnt found`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteStorage = async (req, res) => {
  try {
    const {storage} = req.body;

    const deletedStorage = await Storage.findByIdAndDelete(storage._id);

    await Storage.updateMany(
      { position: { $gte: storage.position } },
      { $inc: { position: -1 } }
    );

    const getStorages = await Storage.find({}).sort({ position: 'asc' }).lean();
    const updatedStorages = getStorages.map((storage, index) => {
      storage.position = index+1;
      return storage
    })

    const operations = updatedStorages.map(storage => ({
      updateOne: {
        filter: { _id: storage._id },
        update: { position: storage.position }
      }
    }));
    
    await Storage.bulkWrite(operations);

    if (deletedStorage && updatedStorages) {
      res.status(201).json({
        updatedStorages: updatedStorages,
        message: `Storage "${storage.name}" removed succesfuly`,
      });
    } else {
      res
        .status(400)
        .json({ message: 'Couldnt delete storage, storage wasnt found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
