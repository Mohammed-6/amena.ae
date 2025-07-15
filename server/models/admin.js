const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const ImageModel = require("./image");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: false },
  phone: { type: String, required: false },
  role: { type: String, required: false },
  password: { type: String, required: false },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10); // Generate a salt
  this.password = await bcrypt.hash(this.password, salt); // Hash password
  next();
});

const seoPageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    keywords: { type: String },
    heading: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ImageModel,
      required: false,
    },
  },
  { timestamps: true }
);

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: String, required: true },
    thumbnail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ImageModel,
      required: false,
    },
  },
  { timestamps: true }
);
// Auto generate slug before saving
// BlogSchema.pre("save", function (next) {
//   if (!this.slug) {
//     this.slug = slugify(this.title, { lower: true, strict: true });
//   }
//   next();
// });

const UserModel = mongoose.model("user", UserSchema);
const SeoPageModel = mongoose.model("seoPage", seoPageSchema);
const BlogModel = mongoose.model("blog", BlogSchema);

module.exports.UserModel = UserModel;
module.exports.SeoPageModel = SeoPageModel;
module.exports.BlogModel = BlogModel;
