import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

const API_URL = "http://localhost:3000/api/extension";
const SUPABASE_URL = "https://ikntoumeerjdsgvjdify.supabase.co";
const SUPABASE_KEY = "sb_publishable_eUt6lWPlD5I_UqdFCmx6oQ_AXc3zyn1";

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY
        },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.access_token);
        setUserId(data.user.id);
        fetchProjects(data.user.id);
        fetchTasks(data.user.id);
      } else {
        alert(data.error_description || 'Login failed');
      }
    } catch (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const fetchProjects = async (uid) => {
    try {
      const res = await fetch(`${API_URL}/projects?userId=${uid}`);
      const data = await res.json();
      if (res.ok && data.length > 0) {
        setProjects(data);
        setSelectedProjectId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const fetchTasks = async (uid) => {
    try {
      const res = await fetch(`${API_URL}/tasks?userId=${uid}`);
      const data = await res.json();
      if (res.ok) setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) return;
    if (!selectedProjectId) {
      alert("Please wait for projects to load or create a project first.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newTaskTitle,
          status: 'TODO',
          priority: 'MEDIUM',
          project_id: selectedProjectId,
          user_id: userId
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTasks([data, ...tasks]);
        setNewTaskTitle('');
      } else {
        alert(data.message || 'Failed to add task');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>SyncBoard Mobile</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#a1a1aa"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#a1a1aa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={login} disabled={loading}>
          {loading ? <ActivityIndicator color="#000" /> : <Text style={styles.buttonText}>Log In</Text>}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Tasks</Text>
      
      <View style={styles.addSection}>
        <TextInput
          style={[styles.input, styles.flexInput]}
          placeholder="New task title..."
          placeholderTextColor="#a1a1aa"
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            <Text style={styles.taskStatus}>{item.status} - {item.priority}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addSection: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  flexInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  taskCard: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#27272a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskStatus: {
    color: '#a1a1aa',
    fontSize: 12,
  }
});
