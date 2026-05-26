# VENDORA — Pakistan's Modern Marketplace

> A full-featured e-commerce marketplace SPA for Pakistani small businesses.

## 🚀 Getting Started

```bash
cd vendora
npm install
npm run dev
```

App runs at **http://localhost:5173**

---

## 🔑 Demo Accounts

| Role   | Email                  | Password    |
|--------|------------------------|-------------|
| Seller | seller@vendora.pk      | seller123   |
| Buyer  | buyer@vendora.pk       | buyer123    |

---

## ✨ Features

### Buyer
- Browse products with search, category filter, price filter, and sort
- Product details page with quantity selector
- Shopping cart with quantity controls
- Checkout with shipping address form
- Order history in dashboard

### Seller
- Dashboard with stats: earnings, sales, active products, pending orders
- Add/Edit/Delete products with image upload
- Manage order statuses (Pending → Confirmed → Shipped → Delivered)
- Seller profile management with business logo

### General
- Email/password authentication with Buyer/Seller role selection
- Session persisted in LocalStorage
- 8 pre-loaded demo products across all categories
- Fully responsive (mobile, tablet, desktop)
- Toast notifications for all actions
- Modal confirmation dialogs

---

## 🏗️ Tech Stack

| Layer        | Technology            |
|--------------|-----------------------|
| Framework    | React 18 + Vite       |
| Styling      | Tailwind CSS v4       |
| Routing      | React Router v6       |
| State        | React Context API     |
| Storage      | LocalStorage          |
| Language     | JavaScript (JSX)      |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/        # Navbar, Footer, Toast, Modal, Loader
│   └── buyer/         # ProductCard
├── context/           # AuthContext, CartContext, ToastContext
├── hooks/             # useAuth, useCart, useToast
├── pages/
│   ├── auth/          # Login, Signup
│   ├── buyer/         # ProductBrowse, ProductDetails, Cart, Checkout, BuyerDashboard
│   └── seller/        # SellerDashboard, ProductsList, ProductForm, OrdersPage, SellerProfile
├── utils/
│   ├── storage.js     # LocalStorage CRUD operations
│   ├── validators.js  # Form validation
│   └── helpers.js     # Formatters, constants, seed data
├── App.jsx            # Routes + providers
├── main.jsx           # Entry point
└── index.css          # Global styles + design system
```

---

## 🎨 Design System

**Colors:**
- Primary: `#6366F1` (Indigo)
- Secondary: `#F59E0B` (Amber)
- Accent: `#10B981` (Emerald)

**Font:** Inter (Google Fonts)

**Currency:** PKR (Pakistani Rupee)

---

## ⚠️ Important Notes

- **Passwords** are stored in plaintext in LocalStorage — this is for demo only. Use bcrypt in production.
- **Images** are stored as base64 in LocalStorage. The 5MB limit prevents storage bloat.
- **LocalStorage limit** is ~5-10MB. For production, migrate to a real backend (Firebase, Supabase, etc.)
