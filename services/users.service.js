const bcrypt = require("bcrypt");
const userRepository = require("../repositories/users.repository");

const createUser = async (userData) => {
  let user = await userRepository.findUserByEmail(userData.email);

  if (user.rows.length > 0) {
    throw new Error("user already exist");
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(userData.password, salt);
  const newUser = { ...userData, password: hashedPassword };

  user = await userRepository.createUser(newUser);
  return user;
};

const login = async (userData) => {
  let user = await userRepository.findUserByEmail(userData.email);

  if (user.rows.length === 0) {
    throw new Error("user doesn't exist");
  }
  
  const isValid = await bcrypt.compare(userData.password, user.rows[0].password);

  return isValid;
};

const getUserById = async (id) => {
  let user = await userRepository.findUserById(id);
  if (!user) {
    throw new Error("user not found");
  }
  return user;
};

module.exports = { createUser, getUserById, login };
