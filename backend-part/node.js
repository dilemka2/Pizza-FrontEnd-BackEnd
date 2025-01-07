const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const exhbs = require('express-handlebars');
const session = require('express-session');
const hbs = require('hbs');
const { Console } = require('console');

dotenv.config({ path: '.env' });

const app = express();

app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false,
    cookie: {secure:false}
}))

hbs.registerHelper('ifEquals', function (value, compareValue, options) {
    if (value === compareValue) {
        return options.fn(this);
    }
    else {
        return options.inverse(this);
    }
})


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE,
})

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log('connected');
    }
})

app.use('/', require('./routes/pages'));

app.post('/register', async (req, res) => {
    try {
       let sqlCheckerMail = 'SELECT * FROM pizza WHERE email = ?';
       db.query(sqlCheckerMail, [req.body.email], (err, results) => {
           if (err) {
               console.error(err);
               return res.status(500).send('something went wrong');
           }
           if (results.length > 0) {
               return res.render('register', {
                   message: 'the email is already used',
                   succes: false
               })
           }
           let user = {
               name: req.body.login,
               email: req.body.email,
               password: req.body.password,
           };

           let sqlInsert = 'INSERT INTO pizza SET ?';
           db.query(sqlInsert, user, (err) => {
               if (err) {
                   console.error(err);
                   return res.status(500).send('something went wrong');
               }
               res.redirect('/login')
           })
       })
   }
   catch (e) {
       console.error(e);
       res.redirect('register')
   }
})


app.post('/login', async (req, res) => {
    try {
        let sqlLogin = 'SELECT * FROM pizza WHERE email = ?';
        db.query(sqlLogin, [req.body.email], async (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).send('something went wrong during cheking te email');
            }
            if (results.length === 0) {
                return res.render('login', {
                    message: 'There are no accounts with that email',
                    success: false
                });
            }
            const user = results[0];
            if (req.body.password !== user.password) {
                return res.render('login', {
                    message: 'Wrong password',
                    success: false
                });
            }
            if (req.body.password === user.password) {
                req.session.userId = user.id; 
                req.session.name = user.name;
                res.render('index',{
                    account: 'is',
                }); 
            }
        })
    }
    catch (e) {
        
    }
})

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Something went wrong while logging out');
        }
        res.redirect('/'); 
    });
});


let port = 1000
app.listen(port, () => {
    console.log(`the server has just been started http://localhost:${port}`)
})