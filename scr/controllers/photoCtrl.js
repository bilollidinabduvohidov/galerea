const JWT = require("jsonwebtoken");

const Photos = require("../models/photoModel");

const path = require("path");
const uuid = require("uuid");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../files");

const photoCtrl = {
  addPhoto: async (req, res) => {
    try {
      const { token } = req.headers;

      const user = await JWT.verify(token, process.env.SECRET_KEY_JWT);
      const { name, category } = req.body;

      const image = req.files.image;

      const imgName = uuid.v4() + "." + image.mimetype.split("/")[1];

      const imgAddr = "/" + imgName;

      image.mv(path.join(uploadsDir, imgName), (err) => {
        if (err) {
          console.log(err);
        }
      });

      const newFoto = await Photos({
        owner: user.id,
        name,
        image: imgAddr,
        category: category
      });

      await newFoto.save();

      res.status(201).send({ msg: "New image created successfully!", newFoto });
    } catch (error) {
      res.send({ msg: error.message });
    }
  },

  getAllPhotos: async (req, res) => {
    try {
      const { token } = req.headers;
      const user = await JWT.verify(token, process.env.SECRET_KEY_JWT);
      if (Object.keys(user)) {
        const photos = await Photos.find({ owner: user.id });
        res.status(200).send({ msg: "barca rasmlar royhati", photos });
      } else {
        res.status(401).send({ msg: "User is not defined" });
      }
    } catch (error) {
      res.send({ msg: error.message });
    }
  },

  getPhotosByPrivate: async (req, res) => {
    try {
      const { token } = req.headers;
      const user = await JWT.verify(token, process.env.SECRET_KEY_JWT);
      if (Object.keys(user)) {
        const photos = await Photos.find({$and: [{ owner: user.id }, { category: "shaxsiy" }]});  
        res.status(200).send({ msg: "Shaxsiy rasmlar", photos });
      }
    } catch (error) {                                                                                           
      res.send({ msg: error.message });
    }
  },

  getPhotosByJobs: async (req, res) => {
    try {
      const { token } = req.headers;
      const user = await JWT.verify(token, process.env.SECRET_KEY_JWT);
      if (Object.keys(user)) {
        const photos = await Photos.find({$and: [{ owner: user.id }, { category: "ish" }]});
        res.status(200).send({ msg: "Ishga bog'liq rasmlar", photos });
      }
    } catch (error) {
      res.send({ msg: error.message });
    }
  },

  deletePhoto: async (req, res) => {
    try {
      const { id } = req.params;
      const photo = await Photos.findByIdAndDelete(id);
      if (photo) {
        fs.unlinkSync(path.join(uploadsDir, photo.image));
        return res.status(200).send({ msg: `${photo.name} photo deleted!` });
      }

      res.status(404).send({ msg: `photo not found!` });
    } catch (error) {
      res.send({ msg: error.message });
    }
  },

  updatePhoto: async (req, res) => {
    try {
      const { id } = req.params;
      try {
        const { image } = req.files;
        const photo = await Photos.findByIdAndUpdate(id, req.body);
        if (photo) {
          const imgName = uuid.v4() + "." + image.mimetype.split("/")[1];

          const imgAddr = "/" + imgName;

          image.mv(path.join(uploadsDir, imgName), (err) => {
            if (err) {
              console.log(err);
            }
          });

          fs.unlinkSync(path.join(uploadsDir, photo.image));
          await Photos.findByIdAndUpdate(id, { image: imgAddr });
          return res.status(200).send({ msg: `${photo.name} photo updated!` });
        }

        res.status(404).send({ msg: `photo not found!` });
      } catch (error) {
        const photo = await Photos.findByIdAndUpdate(id, req.body);
        if (photo) {
          return res.status(200).send({ msg: `${photo.name} photo updated!` });
        }

        res.status(404).send({ msg: `photo not found!` });
      }
    } catch (error) {
      res.send({ msg: error.message });
    }
  }
};

module.exports = photoCtrl;
