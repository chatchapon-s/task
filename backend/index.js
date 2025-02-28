const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

const port = 8000

let users = [];

let conn = null;

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'task',
        port:8830
    })
}

app.use(bodyParser.json());
app.use(cors());


app.get('/',(req,res)=>{
    res.end("Server started");
})

app.get('/tasks', async (req, res) => {
    try {
        const [result] = await conn.execute(
            'SELECT * FROM tashtable'
        );

        res.status(201).json({
                data: result
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/tasks', async (req, res) => {
    try {
        const { title, description, status, due_date } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const finalDescription = description || null;
        const finalDueDate = due_date || null;

        const [result] = await conn.execute(
            'INSERT INTO tashtable (title, description, status, due_date) VALUES (?, ?, ?, ?)',
            [title, finalDescription, status, finalDueDate]
        );

        res.status(201).json({
            message: 'Task created successfully',
            taskId: result.insertId
        });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/tasks', async (req, res) => {
    try {
        const { id, title, description, status } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const [result] = await conn.execute(
            'UPDATE tashtable SET title = ?, description = ?, status = ? WHERE id = ?',
            [title, description, status, id]
        );

        res.status(201).json({
            message: 'Task updated successfully',
            taskId: result.insertId
        });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/tasks', async (req, res) => {
    try {
        const { id} = req.body;
        
        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }

        const [result] = await conn.execute(
            'DELETE FROM tashtable WHERE id = ?',
            [id]
        );

        res.status(201).json({
            message: 'Task deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/tasks/:id', async (req, res) => {
    try {
        const { id} = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }

        const [result] = await conn.execute(
            'SELECT * FROM tashtable WHERE id = ?',
            [id]
        );

        res.status(201).json({
            data: result
        });
    } catch (error) {
        console.error('Error getting task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port,async (req,res)=>{
    await initMySQL();
    console.log('Server start on port'+port);
})