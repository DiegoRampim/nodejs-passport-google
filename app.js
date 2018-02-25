
const express = require('express');
const exphbs = require('express-handlebars')

const passport = require('passport'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// var credentials = require('credentials');

passport.use(new GoogleStrategy({
        clientID: "35521269274-avl2p1nnnut7av8emc3bq7tv4pkou6g6.apps.googleusercontent.com",
        clientSecret: "riIwqh6vVDo92CN_r6Mnv2jo",
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
        console.log("Profile: ", profile);
    }
));

passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    user.findById(id, function(err, user) {
        done(err, user);
    });
});

var app = express();

app.use(require('cookie-parser')("dfkjdlsfjljklsdfj"));
app.use(require('express-session')({
    resave:false,
    saveUninitialized:false,
    secret: "dfkjdlsfjljklsdfj"
}));

app.use(passport.initialize());
app.use(passport.session());

app.engine('handlebars', express({
    defaultLayout:'main'
}));

app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

// GET /auth/google
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Google authentication will involve
//   redirecting the user to google.com.  After authorization, Google
//   will redirect the user back to this application at /auth/google/callback
app.get('/auth/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// GET /auth/google/callback
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

// 500 error handler (middleware)
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('error');
});

app.listen(app.get('port'), function() {
    console.log('Express running on http://localhost:' + app.get('port'));
});