const express = require("express");
const path = require("path");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://sanjayroyal585858:sanjay123@cluster0.9wd2yzu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Error in DB connection", error);
  });

// Define a User schema
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phonenumber: { type: String, required: true },
  password: { type: String, required: true },
});

// Create a User model
const User = mongoose.model("User", userSchema);

// Serve static files from the "Client-side" directory
app.use(express.static(path.join(__dirname, "../Client-side")));

// Route to serve the signup.html file
app.get("/signup.html", (req, res) => {
  res.sendFile("signup.html", { root: __dirname });
});

// Route to serve the login.html file
app.get("/login.html", (req, res) => {
  res.sendFile("login.html", { root: __dirname });
});

// Route to serve the thankyou.html file
app.get("/thankyou.html", (req, res) => {
  res.sendFile("thankyou.html", { root: __dirname });
});

// Route to serve the activity.html file
app.get("/activity.html", (req, res) => {
  res.sendFile("activity.html", { root: __dirname });
});

// Route to handle signup form submission
app.post("/formPost", (req, res) => {
  const { fullname, email, phonenumber, password } = req.body;

  // Create a new user instance with the provided data
  const newUser = new User({
    fullname,
    email,
    phonenumber,
    password,
  });

  // Save the new user to the database
  newUser
    .save()
    .then((savedUser) => {
      console.log(
        `New user registered: ${savedUser.fullname}, Email: ${savedUser.email}, Phone: ${savedUser.phonenumber}, Password: ${savedUser.password}`
      );
      res.sendFile("thankyou.html", { root: __dirname });
    })
    .catch((err) => {
      console.error("Error saving user to the database:", err);
      res.status(500).send("Error saving user to the database.");
    });
});

// Route to handle login form submission
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Find the user by email and check password
  User.findOne({ email })
    .then((user) => {
      if (user && user.password === password) {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Incorrect email or password." });
      }
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).json({ success: false, message: "Error finding user." });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
