const SUPABASE_URL = "https://ikntoumeerjdsgvjdify.supabase.co";
const SUPABASE_KEY = "sb_publishable_eUt6lWPlD5I_UqdFCmx6oQ_AXc3zyn1";
const API_URL = "http://localhost:3000/api/extension";

const loginSection = document.getElementById("login-section");
const taskSection = document.getElementById("task-section");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const addTaskBtn = document.getElementById("add-task-btn");
const loginError = document.getElementById("login-error");
const taskMessage = document.getElementById("task-message");

let accessToken = null;
let userId = null;

// Initialize
chrome.storage.local.get(["syncboard_token", "syncboard_user"], (result) => {
  if (result.syncboard_token && result.syncboard_user) {
    accessToken = result.syncboard_token;
    userId = result.syncboard_user;
    showTaskSection();
  } else {
    showLoginSection();
  }
});

function showLoginSection() {
  loginSection.classList.remove("hidden");
  taskSection.classList.add("hidden");
}

function showTaskSection() {
  loginSection.classList.add("hidden");
  taskSection.classList.remove("hidden");
  taskMessage.innerText = "";
  fetchProjects();
  fetchTasks();
}

async function fetchTasks() {
  const taskList = document.getElementById("task-list");
  try {
    const res = await fetch(`${API_URL}/tasks?userId=${userId}`);
    const tasks = await res.json();
    taskList.innerHTML = "";
    if (tasks.length === 0) {
      taskList.innerHTML = '<p style="font-size: 12px; color: #a1a1aa; text-align: center;">No tasks yet.</p>';
      return;
    }
    tasks.forEach(t => {
      const div = document.createElement("div");
      div.style.padding = "4px 0";
      div.style.borderBottom = "1px solid #27272a";
      div.style.fontSize = "13px";
      div.innerHTML = `<strong>${t.title}</strong> <span style="color:#a1a1aa; float:right; font-size:11px;">${t.status}</span>`;
      taskList.appendChild(div);
    });
  } catch (err) {
    taskList.innerHTML = '<p style="font-size: 12px; color: #ef4444; text-align: center;">Error loading tasks.</p>';
  }
}

async function fetchProjects() {
  const projectSelect = document.getElementById("task-project");
  
  try {
    const res = await fetch(`${API_URL}/projects?userId=${userId}`);
    
    if (!res.ok) throw new Error("Failed to load projects");
    
    const projects = await res.json();
    projectSelect.innerHTML = "";
    
    if (projects.length === 0) {
      projectSelect.innerHTML = '<option value="" disabled>No projects found</option>';
      return;
    }
    
    projects.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.name;
      projectSelect.appendChild(option);
    });
  } catch (err) {
    projectSelect.innerHTML = '<option value="" disabled>Error loading projects</option>';
  }
}

loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  loginError.innerText = "";
  
  if (!email || !password) {
    loginError.innerText = "Please enter email and password.";
    return;
  }
  
  loginBtn.innerText = "Logging in...";
  
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_KEY
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error_description || "Login failed");
    }
    
    accessToken = data.access_token;
    userId = data.user.id;
    
    chrome.storage.local.set({ 
      syncboard_token: accessToken,
      syncboard_user: userId
    }, () => {
      showTaskSection();
    });
  } catch (err) {
    loginError.innerText = err.message;
  } finally {
    loginBtn.innerText = "Log In";
  }
});

logoutBtn.addEventListener("click", () => {
  chrome.storage.local.remove(["syncboard_token", "syncboard_user"], () => {
    accessToken = null;
    userId = null;
    showLoginSection();
  });
});

addTaskBtn.addEventListener("click", async () => {
  const title = document.getElementById("task-title").value;
  const desc = document.getElementById("task-desc").value;
  const priority = document.getElementById("task-priority").value;
  const projectId = document.getElementById("task-project").value;
  
  if (!title) return;
  if (!projectId) {
    taskMessage.innerText = "Please select a project first.";
    taskMessage.style.color = "#ef4444";
    return;
  }
  
  addTaskBtn.innerText = "Adding...";
  taskMessage.innerText = "";
  
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        description: desc || null,
        priority: priority,
        project_id: projectId,
        user_id: userId
      })
    });
    
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to create task");
    }
    
    taskMessage.innerText = "Task added successfully!";
    taskMessage.style.color = "#10b981";
    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
    
    // Refresh the task list immediately
    fetchTasks();
    
    setTimeout(() => { taskMessage.innerText = ""; }, 3000);
  } catch (err) {
    taskMessage.innerText = err.message;
    taskMessage.style.color = "#ef4444";
  } finally {
    addTaskBtn.innerText = "Add Task";
  }
});
