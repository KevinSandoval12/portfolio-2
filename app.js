// Import the express module
import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  .promise();

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
app.get("/db-test", async (req, res) => {
  try {
    const [contatcs] = await pool.query("SELECT * FROM contacts");
    res.send(contacts);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Database error: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/confirm", (req, res) => {
  res.render("confirmation");
});

app.get("/admin", async (req, res) => {
  try {
    const [contacts] = await pool.query("SELECT * FROM orders");
    pool.query("SELECT * FROM orders ORDER BY timestamp DESC");

    contacts.forEach((contact) => {
      contact.formattedTimestamp = new Date(contact.timestamp).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }
      );
    });
    res.render("admin", { contacts });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Database error: " + err.message);
  }
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// const contact = {
//   fname: req.body.fname,
//   lname: req.body.lname,
//   email: req.body.email,
//   meet: req.body.meet,
//   message: req.body.message,
//   format: req.body.format,
//   timestamp: new Date().toLocaleString(),
// };

app.post("/submit-form", async (req, res) => {
  try {
    const contact = req.body;

    contact.timestamp = new Date();

    console.log("New contact recieved:", contact);
    const sql = `INSERT INTO contacts
                  (fname, lname, email, meet, message, format, timestamp)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      contact.fname,
      contact.lname,
      contact.email,
      contact.meet,
      contact.message,
      contact.format,
      contact.timestamp,
    ];

    const [result] = await pool.execute(sql, params);

    console.log("Contact inserted with ID:", result.insertId);

    res.render("confirm", { contact: contact });
  } catch (err) {
    console.error("Error inserting contact:", err);

    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).send("A contact with this email already exists.");
    } else {
      res
        .status(500)
        .send(
          "Sorry, there was an error processing your contact. Please try again."
        );
    }
  }
});

app.post("/close-form", (req, res) => {
  res.render("home");
});

// start the server and make it listen on the port
// specified above
app.listen(PORT, () => {
  console.log(`Sever is running at http://localhost:${PORT}`);
});
