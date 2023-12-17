const path = require("path");
const cloudinary = require("../config/cloudinary");
const Item = require("../model/Item");

const getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("user", "-password").exec();
    if (!items?.length)
      return res.status(400).json({ message: "Item list is empty" });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getItem = async (req, res) => {
  try {
    const product = await Item.findById(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addItem = async (req, res) => {
  const {
    user,
    itemName,
    category,
    quantity,
    price,
    phoneNumber,
    email,
    province,
    district,
    city,
    itemInfo,
  } = req.body;

  if (!user) return res.status(400).json({ message: "User ID required" });

  const images = req.files;

  if (images?.length && images?.length > 4) {
    return res.status(400).json({ message: "You can upload maximum 4 photos" });
  }

  let imageURL = [];

  if (images?.length > 0 && images?.length <= 4) {
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i]?.path, {
        folder: `bikri_${itemName}_by_${email}`,
        use_filename: true,
        format: "jpg",
        overwrite: true,

        transformation: {
          aspect_ratio: "1.0",
          quality: "auto",
          gravity: "auto",
          width: 300,
          height: 300,
          crop: "fill",
        },
      });

      if (!result) {
        return res
          .status(500)
          .json({ message: "image url could not generate" });
      }

      imageURL.push(result.secure_url);
    }
  }

  const newItemObj =
    phoneNumber || images
      ? {
          user,
          itemName,
          category,
          quantity,
          price,
          phoneNumber,
          email,
          province,
          district,
          city,
          images: imageURL,
          itemInfo,
        }
      : {
          user,
          itemName,
          category,
          quantity,
          price,
          email,
          province,
          district,
          city,
          itemInfo,
        };

  try {
    await Item.create(newItemObj);
    res.json({ message: "new item created" });
  } catch (error) {
    // console.log(error);
    res.status(400).json({ error: error.data?.message });
  }
};

const editItem = async (req, res) => {
  const {
    id,
    itemName,
    category,
    quantity,
    price,
    phoneNumber,
    email,
    province,
    district,
    city,
    itemInfo,
    text,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "item id require to edit item" });
  }

  //working for images

  const images = req.files;

  if (images?.length && images?.length > 4) {
    return res.status(400).json({ message: "You can upload maximum 4 photos" });
  }

  let imageURL = [];

  if (images?.length && images?.length <= 4) {
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i]?.path, {
        folder: `bikri_${itemName}_by_${email}`,
        use_filename: true,
        format: "jpg",
        overwrite: true,

        transformation: {
          aspect_ratio: "1.0",
          quality: "auto",
          gravity: "auto",
          width: 300,
          height: 300,
          crop: "fill",
        },
      });

      if (!result) {
        return res
          .status(500)
          .json({ message: "image url could not generate" });
      }

      imageURL.push(result.secure_url);
    }
  }
  //end of working for images

  const findItemToEdit = await Item.findById(id).exec();

  if (!findItemToEdit)
    return res.status(400).json({ message: "no such item found to edit" });

  if (itemName) {
    findItemToEdit.itemName = itemName;
  }
  if (category) {
    findItemToEdit.category = category;
  }

  if (quantity) {
    findItemToEdit.quantity = quantity;
  }
  if (price) {
    findItemToEdit.price = price;
  }
  if (phoneNumber) {
    findItemToEdit.phoneNumber = phoneNumber;
  }
  if (email) {
    findItemToEdit.email = email;
  }
  if (province) {
    findItemToEdit.province = province;
  }
  if (district) {
    findItemToEdit.district = district;
  }
  if (city) {
    findItemToEdit.city = city;
  }
  if (images?.length > 0) {
    findItemToEdit.images = imageURL;
  }
  if (itemInfo) {
    findItemToEdit.itemInfo = itemInfo;
  }
  if (text) {
    findItemToEdit.text = text;
  }

  await findItemToEdit.save();
  res.json({ message: "item edited successfully" });
};

// patch for social reactions
const patchItem = async (req, res) => {};

const deleteItem = async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ message: "id require to delete item" });

  const findItemToDelete = await Item.findById(id).exec();
  if (!findItemToDelete)
    return res.status(400).json({ message: "no such item found to delete" });

  await findItemToDelete.deleteOne();
  res.json({ message: "a item is deleted" });
};

module.exports = {
  getItems,
  addItem,
  editItem,
  patchItem,
  deleteItem,
  getItem,
};
