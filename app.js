
function showCreateProject() {
  document.getElementById('projectModal').style.display = 'block';
}

function hideCreateProject() {
  document.getElementById('projectModal').style.display = 'none';
}

function createProject() {
  const name = document.getElementById('projectName').value;
  if (!name.trim()) return alert("Enter project name");

  fetch('http://localhost:3000/createProject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
    .then(res => res.json())
    .then(() => {
      hideCreateProject();
      loadData();
    });
}

function addTask(projectId) {
  const taskTitle = prompt("Enter task title:");
  if (!taskTitle) return;

  fetch('http://localhost:3000/addTask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId, title: taskTitle })
  }).then(() => loadData());
}

function addComment(taskId) {
  const text = prompt("Enter comment:");
  if (!text) return;

  fetch('http://localhost:3000/addComment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskId, text })
  }).then(() => loadData());
}

function render(data) {
  const board = document.getElementById('project-board');
  board.innerHTML = '';

  data.projects.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';

    const tasks = data.tasks.filter(t => t.projectId === project.id);

    let html = `<h3>${project.name}</h3>`;
    html += `<button onclick="addTask(${project.id})">➕ Task</button>`;

    tasks.forEach(task => {
      const taskComments = data.comments.filter(c => c.taskId === task.id);
      html += `
        <div style="margin:10px; padding:10px; background:#f5f5f5; border-radius:8px;">
          <b>📌 ${task.title}</b>
          <button onclick="addComment(${task.id})">💬 Comment</button>
          <ul>
            ${taskComments.map(c => `<li>${c.text}</li>`).join('')}
          </ul>
        </div>
      `;
    });

    card.innerHTML = html;
    board.appendChild(card);
  });
}

function loadData() {
  fetch('http://localhost:3000/getAll')
    .then(res => res.json())
    .then(data => render(data));
}

window.onload = loadData;
