import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a blog title'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: [true, 'Please add blog content'],
    },
    author: {
      type: String,
      required: [true, 'Please add an author name'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
    },
    tags: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: [true, 'Please add a featured image URL'],
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Slugify title before saving
blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
