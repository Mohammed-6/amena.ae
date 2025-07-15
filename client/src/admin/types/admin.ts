export interface UserType {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}

export interface SeoPageFormData {
  _id?: string;
  title: string;
  slug: string;
  description: string;
  keywords?: string;
  heading: string;
  content: string;
  category: string;
  thumbnail: any;
}

export type BlogFormData = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  thumbnail: any;
  createdAt?: Date;
};
