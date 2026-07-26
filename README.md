# SyncBoard - The Ultimate Cross-Platform Task Manager

SyncBoard is a modern, AI-assisted cross-platform task management application built for my internship assignment at **EmbRadar**. This project showcases a unified database architecture that flawlessly synchronizes tasks across a Web App, Mobile App, Desktop App, and Chrome Extension in real-time.

## 🚀 Features

- **Web Application (Next.js & Supabase):** 
  - Complete Task Management (Create, Update, Delete)
  - Interactive drag-and-drop Kanban Board
  - Dashboard analytics and AI Insights
  - Team collaboration and Workspace invitations
- **Mobile Application (React Native / Expo):**
  - View assigned tasks on the go
  - Quick-capture new tasks directly into your workspace
- **Desktop Application (Tauri & Electron):**
  - Quick-add window for seamless task creation from your desktop
  - Real-time synchronization with the main dashboard
- **Chrome Extension (Vanilla JS):**
  - Access your tasks directly from your browser toolbar
  - Create tasks from any webpage without breaking your workflow

## 🛠️ Technology Stack

- **Frontend:** Next.js 15, React, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** Supabase (PostgreSQL)
- **Mobile:** Expo / React Native
- **Desktop:** Tauri (Rust) / Electron
- **Browser:** Chrome Extension API (Manifest V3)

## 📦 How to Run the Project Locally

First, clone the repository and ensure you have Node.js installed.

### 1. Web Application (Main Dashboard)
```bash
cd syncboard
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

### 2. Mobile Application
```bash
cd syncboard-mobile
npm install
npx expo start
```
Press `w` to open in your web browser, or scan the QR code using the Expo Go app on your phone.

### 3. Desktop Application
```bash
cd syncboard-desktop
npm install
npm start
```
This will launch the lightweight desktop quick-add widget.

### 4. Chrome Extension
1. Open Google Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the `chrome-extension` folder in this repository.
4. Pin the extension to your toolbar and click it to log in!

## 🔐 Environment Variables

To run this project, you need to set up a Supabase project and add the following keys to your `syncboard/.env` file:
```
DATABASE_URL="your-supabase-postgres-connection-string"
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

---
*Developed by Wajid Ali for the EmbRadar MERN Stack Internship Program.*
