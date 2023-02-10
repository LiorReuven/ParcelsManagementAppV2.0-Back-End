import Company from '../models/company.js';

export const getCompanies = async (req, res) => {
  try {

    const allCompanies = await Company.find({}).sort({ position: 'asc' }).lean();

      res.status(200).json({
        allCompanies: allCompanies,
      });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createCompany = async (req, res) => {
  const {company} = req.body;

  //add if exist validation in the future

  try {
    const createdCompany = new Company({
      name: company.name.toUpperCase().trim(),
      releaseUrl: company.releaseUrl.trim(),
    });

    await createdCompany.save();


    res.status(201).json({
      createdCompany: createdCompany,
      message: `Successfuly created the company : ${createdCompany.name}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const {company} = req.body;

  
    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      {
        name: company.name.toUpperCase().trim(),
        releaseUrl: company.releaseUrl.trim(),
      },
      {new:true}
      );


    if (updatedCompany) {
      res.status(201).json({
        updatedCompany: updatedCompany,
        message: `Company updated successfully`,
      });

    } else {
      res.status(400).json({
        message: `Company wasnt found`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const {company} = req.body;

    const deletedCompany = await Company.findByIdAndDelete(company._id);

    if (deletedCompany) {
      res.status(201).json({
        deletedCompany: deletedCompany,
        message: `Company "${company.name}" removed succesfuly`,
      });
    } else {
      res
        .status(400)
        .json({ message: 'Couldnt delete company, company wasnt found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
