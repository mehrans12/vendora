// utils/validators.js — VENDORA Form Validators

export const validators = {
  email: (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  password: (password) => password && password.length >= 6,

  name: (name) => name && name.trim().length >= 2,

  productPrice: (price) => price !== '' && parseFloat(price) > 0,

  productStock: (stock) => stock !== '' && parseInt(stock, 10) >= 0,

  phone: (phone) => {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
  },

  address: (addr) => addr && addr.trim().length >= 5,
};

export const validateAuthForm = (data, isSignup = false) => {
  const errors = {};

  if (!validators.email(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validators.password(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (isSignup) {
    if (!validators.name(data.name)) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!data.role) {
      errors.role = 'Please select a role';
    }
  }

  return errors;
};

export const validateProductForm = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Product name is required (min 2 characters)';
  }

  if (!validators.productPrice(data.price)) {
    errors.price = 'Price must be greater than 0';
  }

  if (!validators.productStock(data.stock)) {
    errors.stock = 'Stock quantity cannot be negative';
  }

  return errors;
};
