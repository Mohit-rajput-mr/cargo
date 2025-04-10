// app/api/upload/route.js
import formidable from 'formidable';
import cloudinary from '../../../lib/cloudinary';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }
      const file = files.file;
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "cargo",
          upload_preset: "cargo", // add preset if required
        });
        return res.status(200).json({ url: result.secure_url });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error uploading to Cloudinary' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
