const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.static('public'));
app.use(express.json());

// Load existing reviews
let reviews = JSON.parse(fs.readFileSync('reviews.json', 'utf-8'));

// Load existing users
let users = [];
if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
}

// Serve reviews
app.get('/get-reviews', (req, res) => {
    res.json(reviews);
});

// Submit review
const reviewsFilePath = './reviews.json';

// Load reviews into memory when the server starts
fs.readFile(reviewsFilePath, 'utf8', (err, data) => {
  if (err && err.code !== 'ENOENT') {
    console.error('Error loading reviews:', err);
  } else if (data) {
    reviews = JSON.parse(data);
  }
});

app.use(express.json());
app.use(express.static('public'));

// API to submit a review
app.post('/submit-review', (req, res) => {
  const { product, review } = req.body;

  if (!product || !review) {
    return res.status(400).json({ error: 'Product name and review are required.' });
  }

  const newReview = { product, review };
  reviews.push(newReview);

  // Save to the file system
  fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2), (err) => {
    if (err) {
      console.error('Error saving reviews:', err);
      return res.status(500).json({ error: 'Failed to save the review.' });
    }

    console.log('Review saved successfully.');
    res.status(200).json({ success: true });
  });
});

// API to fetch all reviews (for the home page)
app.get('/reviews', (req, res) => {
  res.json(reviews);
});

  
// Host login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// User signup


const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const usersFilePath = path.join(__dirname, 'users.json');

// Ensure `users.json` exists
fs.access(usersFilePath, fs.constants.F_OK, (err) => {
    if (err) {
        console.warn('Creating users.json file...');
        fs.writeFileSync(usersFilePath, '[]', 'utf8');
    }
});

// Routes

// Signup Endpoint
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        let users = [];
        if (!err) {
            users = JSON.parse(data);
        }

        // Check if the email is already registered
        const userExists = users.some((user) => user.email === email);

        if (userExists) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // Add the new user
        const newUser = { username, email, password };
        users.push(newUser);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error saving user:', writeErr);
                return res.status(500).json({ error: 'Failed to save user.' });
            }
            res.status(201).json({ success: true });
        });
    });
});



//User-Login
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Login Route
// Login Endpoint
app.post("/user-login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("All fields are required.");
    }

    // Read user data from the file
    fs.readFile(usersFilePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading users file:", err);
            return res.status(500).send("Internal server error.");
        }

        const users = JSON.parse(data || "[]");
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            return res.status(401).send("Invalid email or password.");
        }

        // Redirect to the profile page with username and email
        res.redirect(`/my-profile?username=${encodeURIComponent(user.username)}&email=${encodeURIComponent(user.email)}`);
    });
});


// Serve the My Profile page
app.get('/my-profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'my-profile.html'));
});




// Change Password
app.post('/change-password', (req, res) => {
    const { newPassword } = req.body;

    if (!req.session.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users file:', err);
            return res.status(500).json({ error: 'Server error.' });
        }

        let users = JSON.parse(data);
        users = users.map((user) => {
            if (user.email === req.session.user.email) {
                return { ...user, password: newPassword };
            }
            return user;
        });

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error saving users file:', writeErr);
                return res.status(500).json({ error: 'Failed to update password.' });
            }

            res.status(200).json({ success: true });
        });
    });
});

//Logout
app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.status(200).json({ success: true });
    });
});



// Search reviews
app.get('/search-reviews', (req, res) => {
    const query = req.query.query.toLowerCase();
    const filteredReviews = reviews.filter(review =>
        review.product.toLowerCase().includes(query)
    );
    res.json(filteredReviews);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

