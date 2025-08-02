const http = require('http');
const fs = require('fs');
const path = require('path');

const projectsFile = path.join(__dirname, 'data', 'projects.json');
const tasksFile = path.join(__dirname, 'data', 'tasks.json');
const commentsFile = path.join(__dirname, 'data', 'comments.json');

// Ensure files exist
[projectsFile, tasksFile, commentsFile].forEach(file => {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '[]');
});

const server = http.createServer((req, res) => {
  // CORS for frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // CREATE PROJECT
  if (req.method === 'POST' && req.url === '/createProject') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { name } = JSON.parse(body);
      const projects = JSON.parse(fs.readFileSync(projectsFile));
      const newProject = { id: Date.now(), name };
      projects.push(newProject);
      fs.writeFileSync(projectsFile, JSON.stringify(projects, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Project created', projects }));
    });

  // CREATE TASK
  } else if (req.method === 'POST' && req.url === '/addTask') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { projectId, title } = JSON.parse(body);
      const tasks = JSON.parse(fs.readFileSync(tasksFile));
      const newTask = { id: Date.now(), projectId, title };
      tasks.push(newTask);
      fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Task added', tasks }));
    });

  // ADD COMMENT
  } else if (req.method === 'POST' && req.url === '/addComment') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { taskId, text } = JSON.parse(body);
      const comments = JSON.parse(fs.readFileSync(commentsFile));
      const newComment = { id: Date.now(), taskId, text };
      comments.push(newComment);
      fs.writeFileSync(commentsFile, JSON.stringify(comments, null, 2));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Comment added', comments }));
    });

  // GET ALL DATA
  } else if (req.method === 'GET' && req.url === '/getAll') {
    const projects = JSON.parse(fs.readFileSync(projectsFile));
    const tasks = JSON.parse(fs.readFileSync(tasksFile));
    const comments = JSON.parse(fs.readFileSync(commentsFile));
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ projects, tasks, comments }));

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
