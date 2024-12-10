# Node.js and MongoDB Project

This project is a Node.js server application that uses MongoDB as its database. Below, you'll find information on how to set up and run the project locally.

## Getting Started

### 1. Install dependencies

Run the following command to install the project dependencies:

```bash
npm install
```

### 3. Create a `.env` file

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
PORT=3000
MONGODB_URI=
DB_NAME=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
SECRET_KEY=
REACT_BASE_URL=
```

### 4. Start the server

You can start the server using one of the following scripts:

- **For production:**

  ```bash
  npm start
  ```

- **For development (with hot-reloading):**

  ```bash
  npm run dev
  ```

The server will start on the port specified in the `.env` file (default: `3000`).

### 5. Verify the server

Open your browser or API testing tool (e.g., Postman) and navigate to:

```
http://localhost:3000
```

## Folder Structure

```
project-directory
├── index.js          # Entry point of the server
├── .env              # Environment variables
├── package.json      # Project configuration and scripts
├── node_modules/     # Dependencies
├── README.md         # Project documentation
└── ...               # Additional folders and files
```

## Additional Notes

- Ensure your MongoDB Atlas database is accessible with the provided `MONGODB_URI`.
- Use [Google Cloud Console](https://console.cloud.google.com/) to manage your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- For frontend integration, ensure the `REACT_BASE_URL` matches your React application base URL.

## License

This project is licensed under the [MIT License](LICENSE).

---

If you encounter any issues, feel free to create an issue in the repository or contact the project maintainers.
