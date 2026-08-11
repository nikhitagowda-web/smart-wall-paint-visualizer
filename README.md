# 🎨 Smart Wall Paint Visualizer

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

An intuitive, end-to-end **MEAN stack** web application that empowers non-technical users to realistically preview, compare, and save wall paint options in their own rooms before making a final physical purchase. 

---

## ✨ Key Features

### 🖌️ Interactive & User-Friendly Workspace
* **Point-and-Click Wall Selection:** Easily click the corners of any wall to create an accurate boundary mask. 
* **Custom Color Picker:** Choose from curated swatches or input any custom HEX code to instantly apply millions of colors.
* **Paint Application Modes:** Test out **Single Color**, trendy **Dual-Tone** accents, or use **Compare Colors** to view two shades side-by-side.
* **Realistic Finishes:** Adjust paint opacity and toggle between Matte, Eggshell, Satin, and Glossy finishes.
* **Instant Before/After:** Seamlessly toggle the painted layers on and off to compare with the original photo.

### 💾 Project Management & Admin Analytics
* **Save Custom Designs:** Give your room designs custom titles (e.g., "Dream Living Room"), rate them (1–5 ⭐), and save them directly to your personal portfolio.
* **Download High-Res Previews:** Export a high-quality PNG of your painted room to share with family or contractors.
* **Admin Dashboard:** A real-time analytics panel tracking total image uploads, total saved designs, and dynamically calculating average user satisfaction ratings.

### 🔒 Security & Privacy
* **Secure Authentication:** Complete Login and Registration system with encrypted password hashing (`bcryptjs`) and protected routes.
* **Originality Enforcement:** Users must log in to upload photos, and must agree to copyright/ownership terms before uploading personal room spaces.

---

## 🛠️ Technology Stack

This project is built using the **MEAN** stack, ensuring a modular architecture and clean code separation:
* **Frontend:** Angular (Standalone Components, TypeScript, HTML5 Canvas)
* **Backend:** Node.js & Express.js (RESTful API architecture)
* **Database:** MongoDB & Mongoose (Schema-driven data modeling)

---

## 💡 Important Disclaimers

> **Privacy & Copyright Notice:** By uploading an image to this platform, users confirm that the photo is original, owned by them, and free of copyright or privacy violations.

> **Real-Life Decision Note:** Digital previews offer realistic color representations. However, actual physical paint may look slightly different depending on room illumination, screen calibration, and physical wall texture.

---

## 🚀 How to Run Locally

*(Ensure you have Node.js and MongoDB installed on your system)*

**1. Setup the Backend**
```bash
cd backend
npm install
npm start
