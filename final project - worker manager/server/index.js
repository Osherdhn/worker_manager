require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { ErrorHandler, handleError } = require('./ErrorHandler');

const app = express();
const port = 3001;
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'workerManager_db'
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database as id ' + db.threadId);

    const adminUsername = 'admin';
    const adminPassword = 'Wm123!@#';

    axios.post('http://localhost:3001/api/workerManager_db/users', { username: adminUsername, password: adminPassword })
        .then(response => {
            console.log('Admin user created successfully');
            db.query('UPDATE users SET role = ? WHERE username = ?', ['admin', adminUsername], (err, results) => {
                if (err) {
                    console.error('Error updating admin role:', err);
                    return;
                }
                console.log('Admin role updated successfully');
            });
        })
        .catch(error => {
            console.error('Error creating admin user:', error);
        });
});

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.sendStatus(403);
    }
    next();
};

app.post('/api/workerManager_db/users', async (req, res) => {
    const { username, password } = req.body;
    const role = 'user';
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ message: 'Username already exists' });
                }
                return res.status(500).json({ message: 'Failed to register user' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (err) {
        console.error('Error registering user:', err); 
        res.status(500).json({ message: 'Failed to register user' });
    }
});

app.post('/api/workerManager_db/users/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to login user' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

app.get('/api/workerManager_db/users', authenticateJWT, authorizeAdmin, (req, res, next) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Failed to retrieve users: ', err);
            return res.status(500).json({ message: 'Failed to retrieve users' });
        }
        res.json(results);
    });
});

app.delete('/api/workerManager_db/users/:id', authenticateJWT, authorizeAdmin, (req, res, next) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Failed to delete user: ', err);
            return res.status(500).json({ message: 'Failed to delete user' });
        }
        res.status(200).send(`User with ID: ${id} deleted`);
    });
});

app.get('/api/workerManager_db/employees', authenticateJWT, (req, res, next) => {
    const userId = req.user.id;
    db.query('SELECT * FROM employees WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Database query failed: ', err);
            return next(new ErrorHandler('Database query failed', 500));
        }
        res.json(results);
    });
});

app.post('/api/workerManager_db/employees', authenticateJWT, (req, res, next) => {
    const { name, position, phone, email, image } = req.body;
    const userId = req.user.id;
    if (!name || !position || !email) {
        return next(new ErrorHandler('Name, position, and email are required', 400));
    }
    db.query('INSERT INTO employees (user_id, name, position, phone, email, image) VALUES (?, ?, ?, ?, ?, ?)', [userId, name, position, phone, email, image], (err, results) => {
        if (err) {
            console.error('Failed to insert employee: ', err);
            return next(new ErrorHandler('Failed to insert employee', 500));
        }
        res.status(201).send({ insertId: results.insertId });
    });
});

app.put('/api/workerManager_db/employees/:id', authenticateJWT, (req, res, next) => {
    const { id } = req.params;
    const { name, position, phone, email, image } = req.body;
    const userId = req.user.id;
    if (!name || !position || !email) {
        return next(new ErrorHandler('Name, position, and email are required', 400));
    }
    db.query('UPDATE employees SET name = ?, position = ?, phone = ?, email = ?, image = ? WHERE id = ? AND user_id = ?', [name, position, phone, email, image, id, userId], (err, results) => {
        if (err) {
            console.error('Failed to update employee: ', err);
            return next(new ErrorHandler('Failed to update employee', 500));
        }
        res.status(200).send(`Employee with ID: ${id} updated`);
    });
});

app.delete('/api/workerManager_db/employees/:id', authenticateJWT, (req, res, next) => {
    const userId = req.user.id;
    const { id } = req.params;
    db.query('DELETE FROM employees WHERE id = ? AND user_id = ?', [id, userId], (err, results) => {
        if (err) {
            console.error('Failed to delete employee: ', err);
            return next(new ErrorHandler('Failed to delete employee', 500));
        }
        res.status(200).send(`Employee with ID: ${id} deleted`);
    });
});

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
