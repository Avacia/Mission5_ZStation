# Mission 5: ZStation

## Description
Mission 5: ZStation is a web application designed to remake the Z Station webpage. The design has been provided by a UX designer from Mission Ready HQ. This application offers an interactive user experience with a focus on map functionalities and data management.

## Features

### Frontend
- **Built with React**: Utilizes React and hooks, specifically `useQuery`, to fetch data from the backend API.
- **Navigation**: Implements `NavLink` and `Routes` for seamless navigation between different pages.
- **Map Integration**: Uses Google Maps API to create and modify map features, providing users with interactive geographical information.

### Backend
- **Express Framework**: The backend is built using Express, which allows for easy route management and middleware integration.
- **CORS Middleware**: Ensures that cross-origin requests are handled properly.
- **RESTful API**: Defines routes to manage requests using POST and GET methods. The controllers handle data operations such as sending, updating, and fetching data from a MongoDB database.

### Python CLI
- **Command-Line Interface**: A Python CLI is available, allowing users to easily input desired files into the database for streamlined data management.

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Avacia/Mission5_ZStation.git
   cd Mission5_ZStation
   ```

2. **Install dependencies:**
   - For **Backend**:
   ```bash
   cd backend
   npm install
   ```
   - For **Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the backend folder with your MongoDB connection string and any other required configurations.

4. **Start the development server:**
   - **Backend**:
   ```bash
   npm run dev
   ```
   - **Frontend**:
   ```bash
   cd ../frontend
   npm start
   ```

5. **Open the application:**
   Go to `http://localhost:3000` to access the Z Station interface.

## Application Structure
The application is structured as follows:

```
Mission5_ZStation/
├── backend/
│   ├── controllers/             # Handles API requests and responses
│   ├── middleware/              # Middleware for CORS and other functions
│   ├── routes/                  # Defines API routes
│   ├── models/                  # MongoDB models for data schema
│   ├── server.js                # Main server setup file
│   └── .env                     # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/          # React components
    │   ├── pages/               # Different pages of the application
    │   ├── App.js               # Main application file
    │   └── index.js             # Entry point for React application
    └── public/                  # Public assets
```

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - NoSQL database program
- [Google Maps API](https://developers.google.com/maps) - Provides mapping functionalities
- Mission Ready HQ - For the UX design support
