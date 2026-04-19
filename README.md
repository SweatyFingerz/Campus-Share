# CampusShare

CampusShare is a production-ready, peer-to-peer web application built specifically for university students. It serves as a centralized hub to borrow and lend items (like textbooks and tools) and acts as a campus-wide Lost & Found board to reunite students with their missing belongings.

## 🚀 Live Demo
**[Visit CampusShare Live](https://sweatyfingerz.github.io/Campus-Share/)**

---

## ✨ Key Features

* **Peer-to-Peer Item Library:** Browse a categorized catalogue of items listed by fellow students. Search, filter by category, and check availability status.
* **Borrowing Request System:** Formally request to borrow an item. The owner receives the request and can approve it, automatically transferring the "held by" status.
* **Lost & Found Board:** A dedicated feed to post "Lost" or "Found" items, allowing finders and losers to connect and mark items as visually resolved.
* **Personal Dashboard:** A central control center where users manage their active listings, view items they are currently borrowing, accept/reject incoming borrow requests, and delete old posts.
* **Secure Authentication:** Full user registration and login system powered by Firebase Authentication with protected routes.
* **Modern UI/UX:** Responsive, dynamic, and beautiful interface designed with glassmorphism aesthetics and micro-animations via Tailwind CSS.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 19 (Initialized via Vite)
* **Styling:** Tailwind CSS v4 & Vanilla CSS
* **Routing:** React Router v7 (`HashRouter` optimization for GitHub Pages deployment)
* **Backend BaaS:** Firebase (Authentication & Firestore NoSQL Database)
* **State Management:** React Context API (`AuthContext`, `ItemContext`)
* **Icons:** Lucide React

---

## 📖 How to Use the App

1. **Get Started (Sign In / Register):**
   * Visit the app and create an account by providing your name, email, and a password. This allows you to list items and make borrow requests.
2. **Browsing & Borrowing (Library):**
   * Click on **Library** to see all available items.
   * Use the search bar or filters (e.g., Electronics, Textbooks) to find what you need.
   * Click **Request to Borrow** on an item. The owner will review your request in their Dashboard.
3. **Listing an Item:**
   * In the Library, click **List an Item** to add something you are willing to lend to others.
4. **Managing Requests (Dashboard):**
   * Go to your **Dashboard** to view items you've listed. 
   * If someone requests your item, it will show up under "Pending Requests". You can choose to **Approve** or **Reject** it.
   * When an item is returned to you, click **Mark as Returned** to make it available to the campus again.
5. **Using Lost & Found:**
   * Missing something? Click **Create Post** in the Lost & Found section, select "🔴 I Lost Something", and describe the item.
   * Found a phone or keys? Select "🟢 I Found Something" and leave an optional contact number so the owner can reach you directly.

---

## 💻 Running the Project Locally

If you'd like to run or modify this project on your local machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/SweatyFingerz/Campus-Share.git
   cd Campus-Share
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the localhost URL provided in your terminal (usually `http://localhost:5173`).

### Important Note on Firebase Configuration
This project is hardcoded with a test-mode Firebase configuration. If you plan to deploy this for a real production environment or a different university, you must create your own Firebase Project, update `/src/services/firebaseConfig.js` with your specific API keys, and enable **Firestore** & **Authentication (Email/Password)** in your Firebase Console.

---
*Built as a React Endterm Project.*
