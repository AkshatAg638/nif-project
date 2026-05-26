import Blog from '../models/Blog.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all blogs (filters for category, search, tag, status, and pagination)
// @route   GET /api/blogs
// @access  Public/Private
export const getBlogs = async (req, res, next) => {
  try {
    const { category, search, tag, status, page = 1, limit = 6 } = req.query;

    const query = {};

    // Public users can only see published blogs
    if (!req.user || (req.user.role === 'user')) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: blogs.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post
// @route   GET /api/blogs/:identifier
// @access  Public
export const getBlog = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let blog;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(identifier);
    } else {
      blog = await Blog.findOne({ slug: identifier });
    }

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    // Restrict drafts from unauthenticated users
    if (blog.status === 'draft' && (!req.user || req.user.role === 'user')) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to drafts' });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog post
// @route   POST /api/blogs
// @access  Private (Admin/Editor)
export const createBlog = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = await uploadToCloudinary(req.file.buffer, 'blogs');
    }

    // Set default author name if not supplied
    if (!req.body.author) {
      req.body.author = req.user ? req.user.name : 'Namokriti Writer';
    }

    // Parse tags array
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map((tag) => tag.trim());
    }

    // Rough read time calculation: ~200 words per minute
    if (req.body.content) {
      const wordsCount = req.body.content.split(/\s+/).length;
      const readMinutes = Math.max(1, Math.round(wordsCount / 200));
      req.body.readTime = `${readMinutes} min read`;
    }

    const blog = await Blog.create(req.body);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin/Editor)
export const updateBlog = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.image = await uploadToCloudinary(req.file.buffer, 'blogs');
    }

    // Parse tags array
    if (req.body.tags && typeof req.body.tags === 'string') {
      req.body.tags = req.body.tags.split(',').map((tag) => tag.trim());
    }

    if (req.body.content) {
      const wordsCount = req.body.content.split(/\s+/).length;
      const readMinutes = Math.max(1, Math.round(wordsCount / 200));
      req.body.readTime = `${readMinutes} min read`;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin/Editor)
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    await blog.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
