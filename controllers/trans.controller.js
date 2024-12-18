const Joi = require("joi");
const userService = require("../services/users.service");
const { UserResponse } = require("../dto/userResponse");

const registerSchema = Joi.object({
  user_id: Joi.number().required(),
  date_time: Joi.string().required(),
  type: Joi.string().optional(),
  fromTo: Joi.number().required(),
  description: Joi.string(),
  amount: Joi.number()
});

const createTrans = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    const user = await userService.createTrans(value);
    res.status(201).json({ data: user });
  } catch (error) {
    res.status(error.statusCode || 500).json({ error: error.message });
  };
}

const getTransById = async (req, res) => {
  try {
    const { id } = req.user;
    console.log(req.user)
    const trans = await transService.getTransById(Number(id));
    res.status(200).json({ data: new TransResponse(trans) });
    // res.status(200).json({ data: new UserResponse(user) });
  } catch (error) {
    if (error.message === "user not found") {
      return res.status(404).json({ error: error.message })
    }
    res.status(error.statusCode || 500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    const token = await transService.login(value);
    res.status(200).json({ data: { token: token } });
  } catch (error) {
    if (error.message === "404") {
      return res.status(404).json({ message: "user doesn't exist" });
    }

    if (error.message === "401") {
      return res.status(404).json({ message: "email or password not valid" });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTrans, getTransById}
