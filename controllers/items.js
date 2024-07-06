const mongodb = require('../db/connect');

const ObjectId = require('mongodb').ObjectId;
const collectionNameItems = 'anuncios';


const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDb().db().collection(collectionNameItems).find();
    result.toArray().then((anuncios) => {
      if (anuncios.length === 0) {
        res.status(404).json({ message: 'There are no registered anuncios' });
        return;
      }
      res.status(200).json(anuncios);
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }
    
    const anuncio = await mongodb.getDb().db().collection(collectionNameItems).findOne({ _id: new ObjectId(id) });
    
    if (!anuncio) {
      res.status(404).json({ message: 'Anuncio not found' });
      return;
    }
    
    res.status(200).json(anuncio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const crearAnuncio = async (req, res) => {
  try {
    const anuncioBody = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      imagen: req.body.imagen
    };

    const response = await await mongodb.getDb().db().collection(collectionNameItems).insertOne(anuncioBody);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json ({message: 'Algun error ocurrió creando el anuncio.'})
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const editarAnuncio = async (req, res) => {
  try {
    const itemId = req.params.id;
    
    if (!ObjectId.isValid(itemId)) {
      return res.status(400).json({ message: 'Se debe tener un ID valido para editar un anuncio' });
    }

    const anuncioBody = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      imagen: req.body.imagen,
    };

    const response = await mongodb.getDb().db().collection(collectionNameItems).updateOne(
      { _id: new ObjectId(itemId) },
      { $set: anuncioBody }
    );

    if (response.matchedCount > 0) {
      res.status(200).json(response);
    } else {
      res.status(404).json({ message: 'No se encontró el anuncio con el ID proporcionado.' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const borrarAnuncio = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'Se debe tener un ID valido para borrar un anuncio' });
    }
    const itemId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection(collectionNameItems).deleteOne({_id: itemId }, true);

    if (response.deletedCount > 0) {
      res.status(204).json(response);
    } else {
      res.status(500).json(response.error || 'Algun error ocurrió borrando el anuncio.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    getAll,
    getSingle,
    crearAnuncio,
    editarAnuncio,
    borrarAnuncio,
};
