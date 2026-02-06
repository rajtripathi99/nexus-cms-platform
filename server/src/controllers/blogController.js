import BlogPost from '../models/BlogPost.js';
import { cloudinary } from '../config/cloudinary.js';

// Get all blogs (public)
export const getBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find({ isPublished: true })
      .sort({ publishedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all blogs including unpublished (admin)
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogPost.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single blog by slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await BlogPost.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single blog by ID (admin)
export const getBlogById = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create blog (admin)
export const createBlog = async (req, res) => {
  try {
    // Check if image was uploaded
    const blogData = {
      ...req.body,
      image: req.file ? req.file.path : undefined, // Cloudinary URL
    };
    
    const blog = await BlogPost.create(blogData);
    
    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    // If blog creation fails but image was uploaded, delete the image from Cloudinary
    if (req.file) {
      const publicId = req.file.filename;
      await cloudinary.uploader.destroy(publicId);
    }
    
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update blog (admin)
export const updateBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    
    if (!blog) {
      // Delete uploaded image if blog not found
      if (req.file) {
        const publicId = req.file.filename;
        await cloudinary.uploader.destroy(publicId);
      }
      
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    // If new image is uploaded, delete old image from Cloudinary
    if (req.file && blog.image) {
      // Extract public_id from Cloudinary URL
      const urlParts = blog.image.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = `nexus-cms/blogs/${publicIdWithExtension.split('.')[0]}`;
      
      await cloudinary.uploader.destroy(publicId);
    }
    
    // Update blog data
    const updateData = {
      ...req.body,
    };
    
    // Add new image URL if uploaded
    if (req.file) {
      updateData.image = req.file.path;
    }
    
    const updatedBlog = await BlogPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete blog (admin)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }
    
    // Delete image from Cloudinary if exists
    if (blog.image) {
      const urlParts = blog.image.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = `nexus-cms/blogs/${publicIdWithExtension.split('.')[0]}`;
      
      await cloudinary.uploader.destroy(publicId);
    }
    
    await BlogPost.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};