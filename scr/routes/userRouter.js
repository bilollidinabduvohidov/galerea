const express = require("express")
const router = express.Router()
const userCtrl = require("../controllers/userCtrl")


router.post("/login", userCtrl.login)
router.post("/signup", userCtrl.signUp)
router.get("/user", userCtrl.userInfo)
router.get("/users", userCtrl.getUser)

module.exports = router