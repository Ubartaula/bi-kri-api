const User = require("../model/User");
const bcrypt = require("bcrypt");
const { Worker } = require("worker_threads");
const path = require("path");

const getUsers = async (req, res) => {
  const users = await User.find().select("-password").lean().exec();
  if (!users?.length) return res.json({ message: "No users are listed." });
  res.json(users);
};

const addUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role,
    confirmationCode,
  } = req.body;

  if (!firstName || !lastName || !email || !confirmationCode) {
    return res.status(400).json({
      message:
        "You need to provide name, email and confirmationCode mandatorily",
    });
  }

  // check email validity
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailCheck = emailRegex.test(email);
  if (!emailCheck) {
    return res
      .status(400)
      .json({ message: `The ${email} you have provided is not a valid email` });
  }

  const checkUserWithEmail = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();
  if (checkUserWithEmail)
    return res.status(400).json({ message: "This email is already in use" });

  if (phoneNumber) {
    const checkUserPhoneNumber = await User.findOne({ phoneNumber })
      .lean()
      .exec();
    if (checkUserPhoneNumber)
      return res
        .status(400)
        .json({ message: "This phone number is already in use" });
  }

  if (password?.length < 4)
    return res
      .status(400)
      .json({ message: "Password should have 4 or more character" });

  const hashPassword = await bcrypt.hash(password, 10);

  const newUserObj =
    email || phoneNumber || role || firstName || lastName
      ? {
          firstName,
          lastName,
          email,
          phoneNumber,
          password: hashPassword,
          role,
          confirmationCode,
        }
      : {
          firstName,
          lastName,
          email,
          password: hashPassword,
          confirmationCode,
        };

  const worker = new Worker(path.join(__dirname, "../workers/emailWorker.js"));
  worker.on("message", (result) => {
    if (result.status === "success") {
      //console.log("User created and email sent successfully");
    } else {
      // console.log("Failed to send email");
    }
  });
  worker.postMessage({ email, confirmationCode });

  try {
    await User.create(newUserObj);
    res.json({
      message: `${firstName} with email ${email} is created and you have to confirm it going into your email inbox`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const editUser = async (req, res) => {
  const {
    id,
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    isActive,
  } = req.body;

  if (!id) return res.json({ message: "id require to edit user" });
  // check email validity

  const findUserToEdit = await User.findById(id).exec();
  if (!findUserToEdit)
    return res.json({ message: "No such user found to edit" });

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailCheck = emailRegex.test(email);
    if (!emailCheck)
      return res.status(400).json({ message: "Not valid email format" });

    const findDupEmail = await User.findOne({ email })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();
    if (findDupEmail && !(findDupEmail._id?.toString() === id))
      return res.status(409).json({ message: "This email is already in use" });
  }

  if (phoneNumber) {
    const findDupPhoneNumber = await User.findOne({ phoneNumber })
      .lean()
      .exec();
    if (findDupPhoneNumber && !(findDupPhoneNumber._id?.toString() === id))
      return res
        .status(409)
        .json({ message: "This phone number is already in use" });
  }

  if (password) {
    if (password?.length < 4) {
      return res
        .status(400)
        .json({ message: "Password length should be at least 4 character" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    findUserToEdit.password = hashPassword;
  }

  if (email) {
    findUserToEdit.email = email;
  }
  if (role) {
    findUserToEdit.role = role;
  }
  if (phoneNumber) {
    findUserToEdit.phoneNumber = phoneNumber;
  }

  if (isActive) {
    findUserToEdit.isActive = isActive;
  }

  if (firstName) {
    findUserToEdit.firstName = firstName;
  }
  if (lastName) {
    findUserToEdit.lastName = lastName;
  }

  await findUserToEdit.save();
  res.json({ message: "a user is edited" });
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ message: "Email requires to reset password" });

  const findUser = await User.findOne({ email }).exec();
  if (!findUser)
    return res
      .status(401)
      .json({ message: "We cannot find an account with that email" });

  if (!findUser.isActive)
    return res.status(401).json({
      message: "Your account is deactivated, please contact customer care",
    });

  const otp = Math.floor(Math.random() * 100000);

  const worker = new Worker(path.join(__dirname, "../workers/emailWorker.js"));
  worker.on("message", (result) => {
    if (result.status === "success") {
      //console.log("User created and email sent successfully");
    } else {
      // console.log("Failed to send email");
    }
  });
  worker.postMessage({ email, confirmationCode: otp });

  findUser.resetCode = otp;
  findUser.resetTime = Date.now() + 5 * 60 * 1000;

  await findUser.save();

  res.json({
    message: "Email verification success & code has been sent to your email",
  });
};

const deleteUser = async (req, res) => {
  const { id } = req.body;
  if (!id)
    return res.status(400).json({ message: " id require to delete a user" });

  const findUserToDelete = await User.findById(id).exec();
  if (!findUserToDelete)
    return res.status(400).json({ message: " no such user found to delete" });

  await findUserToDelete.deleteOne();
  res.json({ message: "a user is deleted" });
};

const confirmEmail = async (req, res) => {
  const { email, confirmationCode } = req.body;
  if (!email || !confirmationCode) {
    return res
      .status(400)
      .json({ message: "Email and confirmation code required" });
  }
  const findUser = await User.findOne({ email }).exec();
  if (!findUser) {
    return res.status(400).json({ message: "User with email could not find" });
  }

  if (findUser.confirmationCode?.toString() !== confirmationCode?.toString()) {
    return res
      .status(400)
      .json({ message: "Confirmation code did not match " });
  }

  findUser.isEmailConfirmed = true;

  try {
    await findUser.save();
    res.json({ message: "Yoh have successfully confirmed your email." });
  } catch (error) {
    res.error({ error: error.message });
  }
};

const confirmOTP = async (req, res) => {
  // http method GET
  const { resetCode, resetTime } = req.body;

  if (!resetCode) return res.status(400).json({ message: "Code required" });

  const findOTPmatchUser = await User.findOne({ resetCode }).exec();
  if (!findOTPmatchUser)
    return res.status(400).json({ message: "No such code matched" });

  if (findOTPmatchUser.resetTime < resetTime) {
    return res.status(401).json({ message: "Reset time expired" });
  }

  findOTPmatchUser.isResetCodeVerified = true;
  await findOTPmatchUser.save();

  res.json({ message: "Successfully verified" });

  // end of line
};

const passwordReset = async (req, res) => {
  // HTTP method PATCH
  const { resetCode, password } = req.body;
  if (!resetCode || !password)
    return res.status(400).json({ message: "Code and Password field empty" });

  const findOTPmatchUser = await User.findOne({ resetCode }).exec();

  if (!findOTPmatchUser)
    return res.status(400).json({ message: "Code did not match" });

  const hashPassword = await bcrypt.hash(password, 10);

  findOTPmatchUser.password = hashPassword;

  await findOTPmatchUser.save();
  res.json({ message: "Successfully reset password !" });
};

module.exports = {
  getUsers,
  addUser,
  editUser,
  deleteUser,
  sendOTP,
  confirmEmail,
  confirmOTP,
  passwordReset,
};
