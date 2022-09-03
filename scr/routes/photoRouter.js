const express = require("express")
const router = express.Router()
const photoCtrl = require("../controllers/photoCtrl")


router.post("/photo", photoCtrl.addPhoto)
router.get("/myphotos", photoCtrl.getAllPhotos)
router.get("/myphotos/private", photoCtrl.getPhotosByPrivate)
router.get("/myphotos/jobs", photoCtrl.getPhotosByJobs)
router.delete("/photo/:id", photoCtrl.deletePhoto)
router.put("/photo/:id", photoCtrl.updatePhoto)

module.exports = router