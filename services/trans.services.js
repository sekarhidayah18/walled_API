const bcrypt = require("bcrypt");
const userRepository = require("../repositories/users.repository");
const { generateAccessToken } = require("../utils/auth.util")

const createTrans = async (userData) => {
  let user = await userRepository.findTransByEmail(userData.email);
  if (user.rows.length > 0) {
    throw new Error("user already exist");
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(userData.password, salt)
  const newUser = { ...userData, password: hashedPassword };

  user = await userRepository.createTrans(newUser)
  return user;
};

const login = async (userData) => {
  let user = await userRepository.findTransByEmail(userData.email);

  if (user.rows.length === 0) {
    throw new Error(404);
  }

  const isPasswordMatched = await bcrypt.compare(
    userData.password,
    user.rows[0].password
  );

  if (!isPasswordMatched) {
    throw new Error(401);
  }

  const token = generateAccessToken({ email: userData.email, id: user.rows[0].id });

  return token;
};


const getTransById = async (id) => {
  let user = await userRepository.getTransbyId(id);
  if (!user) {
    throw new Error("user not found");
  }
  return user;
};


module.exports = { createTrans, getTransById, login };
