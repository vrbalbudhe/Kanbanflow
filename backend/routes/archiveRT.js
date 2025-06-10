const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { uploadFiles, getFiles, deleteFile, deleteMultiple } = require('../controllers/archive/archiveController');
const router = express.Router();

router.get('/files', getFiles);
router.delete('/file/:id', deleteFile);
router.post('/files/delete', deleteMultiple);
router.post('/upload', upload.array('files'), uploadFiles);

module.exports = router;
