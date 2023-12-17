const cloudinary = require("../config/cloudinary");
const Item = require("../model/Item");
const Comment = require("../model/Comment");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

const getComments = async (req, res) => {
  const comments = await Comment.find()
    .populate("user", "-password")
    .populate("item")
    .lean()
    .exec();
  if (!comments?.length)
    return res.status(400).json({ message: "no comment data available" });

  res.json(comments);
};

const addComment = async (req, res) => {
  const { user, item, text } = req.body;

  if (!user || !item)
    return res
      .status(400)
      .json({ message: "user id and item id are compulsory " });

  const newObj = {
    user,
    item,
    text,
  };

  try {
    await Comment.create(newObj);
    res.json({ message: "new comment created" });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ message: "error while creating a new comment object" });
  }
};

const editComment = async (req, res) => {
  const { id, text } = req.body;

  if (!id)
    return res.status(400).json({ message: "id require to edit comment" });

  const findCommentToEdit = await Comment.findById(id).exec();
  if (!findCommentToEdit)
    return res.status(400).json({ message: "no such comment found to edit" });

  findCommentToEdit.text = text;
  await findCommentToEdit.save();
  res.json({ message: "comment edited successfully" });
};

const deleteComment = async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ message: "id require to delete comment" });

  const findCommentToDelete = await Comment.findById(id).exec();
  if (!findCommentToDelete)
    return res.status(400).json({ message: "no such comment found to delete" });

  await findCommentToDelete.deleteOne();
  res.json({ message: "a comment is deleted" });
};

module.exports = {
  getComments,
  addComment,
  editComment,
  deleteComment,
};
