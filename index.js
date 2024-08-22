const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const oracledb = require("oracledb");
const dbConfig = require("./dbConfig");
const dbConnection = require("./dbConnection");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const session = require("express-session");

app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(bodyparser.urlencoded({ extended: true }));
const port = 3001;
app.set("view engine", "ejs");

// ___________________________For Home Page _________________________________
app.get("/", (req, res) => {
  //   res.send("Hello World!");
  //   res.sendFile(__dirname + "/signup.ejs");
  res.render("home");
});

// ___________________________For Sign Up Page _________________________________
app.get("/signup", (req, res) => {
  res.render("signup");
});
app.post("/signup", async (req, res) => {
  const name = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  // Check password length
  if (password.length <= 7) {
    console.log("Password must be greater than 7 characters");
    return res.status(400).render("error", {
      message: "Password must be greater than 7 characters",
      message1: "Please enter password greater than 7 characters",
      link: "/signup",
    });
  }

  var sql = `INSERT INTO user_information(pname,username,passwords) VALUES ('${name}','${email}','${password}')`;

  if (name == "" || email == "" || password == "") {
    return res.status(400).send("All fields are required");
  } else {
    async function run() {
      let connection;
      try {
        connection = await dbConnection.getConnection();
        const result = await connection.execute(sql, [], { autoCommit: true });
        console.log("inserted");
      } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error");
      } finally {
        if (connection) {
          try {
            await dbConnection.closeConnection(connection);
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
    run();
    let user = [[name], [email]];
    res.render("dashboard", { user: user, welcomeMessage: "Welcome, Dear" });
  }
});

// _______________________For Login Page ______________________________
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    async function run() {
      let connection;
      try {
        connection = await dbConnection.getConnection();
        const result = await connection.execute(
          `SELECT * FROM user_information WHERE username='${email}' AND passwords='${password}'`
        );
        console.log(result.rows);
        if (result.rows.length > 0) {
          req.session.loggedin = true;
          req.session.username = email;
          // res.redirect("/dashboard");
          res.render("dashboard", {
            user: result.rows[0],
            welcomeMessage: "Welcome Back,",
          });
          // res.send("Welcome back, " + email + "!" + " <a href='/'>Home</a>");
        } else {
          res.render("error", {
            message: "Incorrect Username and/or Password!",
            message1: "Please enter correct username and password",
            link: "/login",
          });
        }
        res.end();
      } catch (err) {
        console.error(err);
      } finally {
        if (connection) {
          try {
            await dbConnection.closeConnection(connection);
            //   console.error(err);
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
    run();
  } else {
    console.log(req.body);
    res.send(
      "Please enter Username and Password!" + " <a href='/login'>Login</a>"
    );
    res.end();
  }
});

// ________________________For Logout Page ______________________________
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// _______________________For About Us Page ______________________________
app.get("/about", (req, res) => {
  res.render("about");
});

// _______________________For Quiz Page ______________________________
app.get("/introduction", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/introduction.html"));
});

// Route for quiz.html
app.get("/quiz.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/quiz.html"));
});
// _______________________For Choice Page(Lectures) ______________________________
app.get("/choice", (req, res) => {
  res.render("choice");
});
// ______________________ For Learn Part of Speech Page _______________________
// GET request handler for /learnpartofspeech
app.get("/learnpartofspeech", (req, res) => {
  res.render("learnpartofspeech");
});
// POST request handler for /learnpartofspeech

app.post("/learnpartofspeech", async (req, res) => {
  // Get the word from the request body
  const word = req.body.wordInput;

  // Validate if word is empty
  if (!word || word.trim() === "") {
    res.send("Please enter a word");
    return;
  }

  // Connect to the database
  let connection;
  try {
    connection = await dbConnection.getConnection();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }

  // Build and execute the SQL query
  const sql = `SELECT  SPEECH_CATEGORY FROM partsofspeech  WHERE words = :word`;

  try {
    const result = await connection.execute(
      sql,
      { word: word },
      { autoCommit: true }
    );

    // Handle results
    const meaning = result.rows.length > 0 ? result.rows[0][0] : undefined;
    console.log(meaning);

    res.render("learnpartofspeech", { result: meaning, word: word });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the connection
    if (connection) {
      try {
        await dbConnection.closeConnection(connection);
      } catch (err) {
        console.error(err);
      }
    }
  }
});
// ______________________ For Learn Sentence Type Page _______________________

// GET request handler for /learnsentencetype
app.get("/learnsentencetype", (req, res) => {
  res.render("learnsentencetype");
});

// POST request handler for /learnsentencetype
app.post("/learnsentencetype", async (req, res) => {
  // Get the word from the request body
  const word = req.body.wordInput;

  // Validate if word is empty
  if (!word || word.trim() === "") {
    res.send("Please enter a word");
    return;
  }

  // Connect to the database
  let connection;
  try {
    connection = await dbConnection.getConnection();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
    return;
  }

  // Build and execute the SQL query
  const sql = `SELECT sentence_text FROM Sentence WHERE sentence_type = :word`;

  try {
    const result = await connection.execute(
      sql,
      { word: word },
      { autoCommit: true }
    );

    // Handle results
    const sentences =
      result.rows.length > 0 ? result.rows.map((row) => row[0]) : undefined;
    console.log(sentences);

    res.render("learnsentencetype", { result: sentences, word: word });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    // Close the connection
    if (connection) {
      try {
        await dbConnection.closeConnection(connection);
      } catch (err) {
        console.error(err);
      }
    }
  }
});
// ______________________ For Learn Word Meaning Page _______________________
app.get("/learnwordmeaning", (req, res) => {
  res.render("learnwordmeaning");
});

app.post("/learnwordmeaning", async (req, res) => {
  const word = req.body.wordInput.toLowerCase();

  if (!word || word.trim() === "") {
    res.send("Please enter a word");
    return;
  }

  let connection;
  try {
    connection = await dbConnection.getConnection();
    const sql = `SELECT meaning FROM Dictionary2 WHERE LOWER(words) = :word`;
    const result = await connection.execute(
      sql,
      { word },
      { autoCommit: true }
    );

    const meanings =
      result.rows.length > 0 ? result.rows.map((row) => row[0]) : undefined;
    console.log(meanings);

    res.render("learnwordmeaning", { result: meanings, word });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    if (connection) {
      try {
        await dbConnection.closeConnection(connection);
      } catch (err) {
        console.error(err);
      }
    }
  }
});

// Serve the HTML page
app.use(express.static("public"));

app.listen(port, () => {
  console.log(`The app listening at http://localhost:${port}`);
});
