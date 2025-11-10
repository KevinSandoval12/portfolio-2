// Import the express module
import express from "express";

// Create an instance of an Express application
const app = express();

app.set("view engine", "ejs");

// Enable static files serving
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

// Define the port number where our server will listen

const contacts = [];

const PORT = 3111;
// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/confirm", (req, res) => {
  res.render("confirmation");
});

app.get("/admin", (req, res) => {
  res.render("admin", { contacts });
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/submit-form", (req, res) => {
  const contact = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    meet: req.body.meet,
    message: req.body.message,
    format: req.body.format,
    timestamp: new Date().toLocaleString(),
  };
  contacts.push(contact);
  res.render("confirmation", { contact });
});

app.post("/close-form", (req, res) => {
  res.render("home");
});

// start the server and make it listen on the port
// specified above
app.listen(PORT, () => {
  console.log(`Sever is running at http://localhost:${PORT}`);
});
