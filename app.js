// Import the express module
import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql2
  .createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
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
    const [contacts] = await pool.query("SELECT * FROM contacts");
    res.send(contacts);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).send("Database error: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.render("home");
});

app.post("/confirm", async (req, res) => {
  try {
    // Get form data from req.body

    const contact = req.body;

    // Log the contact data (for debugging)

    console.log("New contact submitted:", contact);

    // SQL INSERT query with placeholders to prevent SQL injection

    const sql = `INSERT INTO contacts(fname, lname, email, met, metInfo, message, format)

 VALUES (?, ?, ?, ?, ?, ?, ?);`;

    // Parameters array must match the contact of ? placeholders

    // Make sure your property names match your contact names

    const params = [
      contact.fname,

      contact.lname,

      contact.email,

      contact.met,

      contact.metInfo,

      contact.message,

      contact.format,
    ];

    // Execute the query and grab the primary key of the new row

    const [result] = await pool.execute(sql, params);

    console.log("Contact saved with ID:", result.insertId);

    // Render confirmation page with the adoption data

    res.render("confirmation", { contact });
  } catch (err) {
    console.error("Error saving contact:", err);

    res
      .status(500)
      .send(
        "Sorry, there was an error processing your contact. Please try again."
      );
  }
});

app.get("/admin", async (req, res) => {
  try {
    const [contacts] = await pool.query("SELECT * FROM contacts");
    pool.query("SELECT * FROM contacts ORDER BY timestamp DESC");

    contacts.forEach((contact) => {
      contact.formattedTimestamp = new Date(contact.timestamp).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          hour12: true,
          timeZoneName: undefined,
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

    const email = contact.email || null;
    const format = contact.format || null;
    const message = contact.message || null;
    const metInfo = contact.metInfo || null;

    const wantsMailingList = contact.mailingList === "on";
    if (wantsMailingList && (!email || !format)) {
      return res.status(400).send(
      "Please provide a valid email and format if you want to join the mailing list."
      );
    }



    console.log("New contact recieved:", contact);
    const sql = `INSERT INTO contacts
                  (fname, lname, email, met, metInfo, message, format, timestamp)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      contact.fname,
      contact.lname,
      contact.email,
      contact.met,
      contact.metInfo,
      contact.message,
      contact.format,
      contact.timestamp,
    ];

    const [result] = await pool.execute(sql, params);

    console.log("Contact inserted with ID:", result.insertId);

    res.render("confirmation", { contact: contact });
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
