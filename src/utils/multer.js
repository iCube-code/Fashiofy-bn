const multer = require("multer");
const { fileTypeFromBuffer } = require("file-type");

const validateFileContent = async (buffer) => {
  try {
    const fileType = await fileTypeFromBuffer(buffer);

    if (!fileType) {
      return { isValid: false, error: "Unable to determine file type" };
    }

    const allowedMimeTypes = ["image/jpeg", "image/png"];
    const allowedExtensions = ["jpg", "jpeg", "png"];

    if (
      !allowedMimeTypes.includes(fileType.mime) ||
      !allowedExtensions.includes(fileType.ext)
    ) {
      return {
        isValid: false,
        error:
          "Invalid file type detected. Only JPEG and PNG images are allowed.",
      };
    }

    return { isValid: true, detectedType: fileType };
  } catch (error) {
    return { isValid: false, error: "Failed to validate file content" };
  }
};

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png"];
  const allowedExts = [".png", ".jpeg", ".jpg"];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only PNG and JPEG images are allowed"), false);
  }

  const hasValidExt = allowedExts.some((ext) =>
    file.originalname.toLowerCase().endsWith(ext)
  );

  if (!hasValidExt) {
    return cb(new Error("File extension must be .png, .jpeg, or .jpg"), false);
  }

  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.com$/i,
    /\.scr$/i,
    /\.pif$/i,
    /\.msi$/i,
    /\.dll$/i,
    /\.vbs$/i,
    /\.js$/i,
    /\.jar$/i,
    /\.php$/i,
    /\.asp$/i,
    /\.jsp$/i,
    /\.py$/i,
  ];

  const originalNameLower = file.originalname.toLowerCase();
  const hasSuspiciousPattern = suspiciousPatterns.some((pattern) =>
    pattern.test(originalNameLower)
  );

  if (hasSuspiciousPattern) {
    return cb(new Error("Suspicious file detected"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
  fileFilter: fileFilter,
}).array("productImages", 5);

const validateImageContent = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      if (!file.buffer || file.buffer.length === 0) {
        return res.status(400).json({
          error: "No file data provided or file is empty",
        });
      }

      const validation = await validateFileContent(file.buffer);

      if (!validation.isValid) {
        return res.status(400).json({
          error: validation.error,
        });
      }

      const bufferStart = file.buffer.slice(0, 20);

      const executableSignatures = [
        Buffer.from([0x4d, 0x5a]),
        Buffer.from([0x7f, 0x45, 0x4c, 0x46]),
        Buffer.from([0xcf, 0xfa, 0xed, 0xfe]),
        Buffer.from([0x50, 0x4b, 0x03, 0x04]),
        Buffer.from([0x52, 0x61, 0x72, 0x21]),
      ];

      const isExecutable = executableSignatures.some((sig) => {
        return bufferStart.indexOf(sig) === 0;
      });

      if (isExecutable) {
        return res.status(400).json({
          error: "Executable files are not allowed, even with image extensions",
        });
      }

      const imageSignatures = {
        jpeg: [Buffer.from([0xff, 0xd8, 0xff])],
        png: [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      };

      const isValidImageSignature =
        imageSignatures.jpeg.some((sig) => bufferStart.indexOf(sig) === 0) ||
        imageSignatures.png.some((sig) => bufferStart.indexOf(sig) === 0);

      if (!isValidImageSignature) {
        return res.status(400).json({
          error: "File does not have a valid image signature",
        });
      }

      file.detectedType = validation.detectedType;
    }

    next();
  } catch (error) {
    console.error("Error in file content validation:", error.message);
    return res.status(400).json({
      error: "Failed to validate file content",
    });
  }
};

const handleUploadErrors = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(400).json({ error: "File size exceeds 5MB limit" });
      case "LIMIT_FILE_COUNT":
        return res.status(400).json({ error: "Maximum 5 images allowed" });
      case "LIMIT_UNEXPECTED_FILE":
        return res
          .status(400)
          .json({ error: 'Unexpected field name. Use "productImages"' });
      default:
        return res.status(400).json({ error: "File upload error" });
    }
  }

  if (error.message) {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = {
  upload,
  validateImageContent,
  handleUploadErrors,
};
