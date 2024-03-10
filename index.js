const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");


const app = express();

// DB Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Ivan@1928",
    database: "smpc_login"
})


// Middleware
app.use(cors());
app.use(express.json());

//API Registration
app.post("/api/registration", async (req, res) => {

    const qValidate = "SELECT * FROM users WHERE email = ?";

    const qInsert = "INSERT INTO users(`name`, `email`, `password`) VALUES (?,?,?)";

    const name = req.body.name;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 12);

    db.query(qValidate, [email], (err, data) => {
        if(err) return res.json({message: 'An error occured'});

        if(data.length > 0) {
            
            return res.json({message: 'The user already exists. Please use a different email address.'});
        } else {
            
            db.query(qInsert, [name, email, password], (err, data) => {
                console.log(err);
                if(err) return res.json({message: 'An error occured'}); 
                
                return res.json({message: 'You have successfully registered.'});
            })
         }
         db.end();
    })

})

//API Login
app.post("/api/admin", (req, res) => {
    const {email, password} = req.body;

    const q = "SELECT * FROM users WHERE email = ?";

    db.query(q, [email], async (err, data) => { 
        if(err) {
            return res.json({message: 'An error occured'});
        } else {
            if(data.length > 0) {
                const user = data[0];

                const match = await bcrypt.compare(password, user.password);

                if(match) {
                    return res.json({message: 'Logged in succesfully', success: true});
                } else {
                    return res.json({message: 'Invalid email address and/or password.', success: false})
                }
            } else{
  
            }
        }
    })
})


// Listener
app.listen(8000, () => {
    console.log("Server is running on port 8000...")
})