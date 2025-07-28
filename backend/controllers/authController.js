const authService = require("../services/authServices");

const signUp = async (req, res) => {
  try {
    const result = await authService.signUp(req);  // we can also send parameters extracting before but we decided to send whole body
    res.status(201).json({ result });
  } catch (error) {                                      
    res.status(400).json({ error: error.message });      
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req);
    res.status(200).json({ result });                    
  } catch (error) {                                      
    res.status(400).json({ error: error.message });      
  }
};

module.exports = {
  signUp,
  login
};
