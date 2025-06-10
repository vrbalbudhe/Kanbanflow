const fs = require('fs');
const path = require('path');
const multer = require('multer');

const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
     fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, uploadsDir);
     },
     filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
     }
});

const upload = multer({ storage });

const filesDB = [];

const uploadFiles = (req, res) => {
     const uploadedFiles = req.files.map(file => {
          const ext = path.extname(file.originalname);
          const newPath = file.path + ext;

          fs.renameSync(file.path, newPath);
          const fileRecord = {
               id: Date.now() + Math.random(),
               name: file.originalname,
               size: file.size,
               type: file.mimetype,
               lastModified: Date.now(),
               uploadDate: new Date(),
               path: file.path,
               url: `/uploads/${file.filename}`
          };
          filesDB.push(fileRecord);
          return fileRecord;
     });

     res.status(200).json(uploadedFiles);
};

const getFiles = (req, res) => {
     const { search = "", filter = "all" } = req.query;

     // Ensure filesDB is an array
     if (!Array.isArray(filesDB)) {
          return res.status(500).json({ error: "Internal files storage is corrupted." });
     }

     const filtered = filesDB.filter((file) => {
          const nameMatch = file.name?.toLowerCase().includes(search.toLowerCase());

          const type = file.type || ""; // Safety in case type is undefined

          const typeMatch =
               filter === "all" ||
               (filter === "images" && type.startsWith("image/")) ||
               (filter === "documents" &&
                    (type.includes("pdf") || type.includes("doc") || type.includes("word"))) ||
               (filter === "videos" && type.startsWith("video/")) ||
               (filter === "audio" && type.startsWith("audio/"));

          return nameMatch && typeMatch;
     });

     res.status(200).json(filtered);
};

const deleteFile = (req, res) => {
     const { id } = req.params;
     const index = filesDB.findIndex(file => file.id == id);

     if (index === -1) return res.status(404).json({ message: "File not found" });

     const [file] = filesDB.splice(index, 1);

     fs.unlink(file.path, err => {
          if (err) console.error("Failed to delete file:", err);
     });

     res.status(200).json({ message: "File deleted", id });
};

const deleteMultiple = (req, res) => {
     const { ids } = req.body;
     const removed = [];

     ids.forEach(id => {
          const index = filesDB.findIndex(file => file.id == id);
          if (index !== -1) {
               const [file] = filesDB.splice(index, 1);
               fs.unlink(file.path, err => {
                    if (err) console.error("Failed to delete file:", err);
               });
               removed.push(id);
          }
     });

     res.status(200).json({ message: "Files deleted", ids: removed });
};

module.exports = {
     upload,
     uploadFiles,
     getFiles,
     deleteFile,
     deleteMultiple
};
