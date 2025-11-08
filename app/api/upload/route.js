import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import cloudinary from '../../../lib/cloudinary';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return new Response(
        JSON.stringify({ error: 'No file provided or invalid file' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create temporary file path
    const uploadDir = join(process.cwd(), 'temp');
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const fileExtension = file.name.split('.').pop() || 'jpg';
    const tempFilePath = join(uploadDir, `upload-${Date.now()}.${fileExtension}`);
    
    // Write file to temp directory
    await writeFile(tempFilePath, buffer);

    try {
      // Upload to Cloudinary - can upload from buffer directly
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "cargo",
            upload_preset: "cargoo",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      // Clean up temp file
      await unlink(tempFilePath).catch(() => {});

      return new Response(
        JSON.stringify({ url: uploadResult.secure_url }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (uploadError) {
      console.error('Cloudinary upload error:', uploadError);
      // Clean up temp file on error
      await unlink(tempFilePath).catch(() => {});
      return new Response(
        JSON.stringify({ error: uploadError.message || 'Error uploading to Cloudinary' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Upload error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error uploading file' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
