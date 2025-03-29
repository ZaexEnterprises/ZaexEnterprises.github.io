const express = require('express');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const port = 3000;

// Configure Passport
passport.use(new LocalStrategy((username, password, done) => {
  if (username === 'admin' && password === 'password') {
    return done(null, { id: 1, username: 'admin' });
  } else {
    return done(null, false);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id, username: 'admin' }));

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/login', (req, res) => {
  res.send('<form method="post" action="/login"><input type="text" name="username"><input type="password" name="password"><button type="submit">Login</button></form>');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send('Hello, ' + req.user.username);
  } else {
    res.redirect('/login');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
