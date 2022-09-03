const bcrypt = require("bcrypt")
const JWT = require("jsonwebtoken")

const User = require("../models/userModel")


const userCtrl = {

  signUp: async(req, res)=> {
    try {
      const {name, password, email,} = req.body

      if(!name || !password || !email) {
        return res.status(400).send({msg: "Please fill all lines"})
      }

      const checkUser = await User.findOne({email})

      if(checkUser) {
        return res.status(403).send({msg: "This email already exist!"})
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const newUser = await User({name, password: hashedPassword, email,})
  
      await newUser.save()
  
      res.status(201).send({msg: "Signup successfully!"})

      
    } catch (error) {
      res.send({msg: error.message})
    }
  },

  login: async (req, res)=> {    
    try {
      const {email, password} = req.body
      if(!email || !password) {
        return res.status(400).send({msg: "Please fill all lines"})
      }
      const user = await User.findOne({email})
      
      if(user) {
        const verifyPass = await bcrypt.compare(password, user.password)

        if(verifyPass) {
          const token = await JWT.sign({id: user.id, name: user.name}, process.env.SECRET_KEY_JWT)
          return res.status(200).send({msg: 'Login successfully', token})
        }
      }
      res.status(401).send({msg:"Email or password incorrect!"})
    } catch (error) {
      res.send({msg: error.message})
    }
    
  },


  userInfo: async (req, res) => {
    try {
      const {token} = req.headers

      const user = await JWT.verify(token, process.env.SECRET_KEY_JWT)
      if(user) {
        return res.send({msg: 'ok', user})
      }
      res.send({msg: "token bilan bog'liq xato ro'y berdi!"})
    } catch (error) {
      res.send({msg: error.message})
    }
  },

  getUser: async (req, res) => {
    try {
      const users = await User.find({})
      res.send(users)
    } catch (error) {
      res.send({msg: error.message})
    }
  }
}


module.exports = userCtrl