import { Component, h, State } from '@stencil/core';

@Component({
  tag: 'taks-list',
  styleUrl: 'tareas.css',
  shadow: true,
})
export class TaskManager {
  @State() tasks: any[] = [];
  @State() newTask = { nombre: '', descripcion: '', estado: '' };
  @State() editingTask: any = null;

  componentWillLoad() {
    this.fetchTasks();
  }

  fetchTasks() {
    fetch('http://localhost:3000/tarea')
      .then(response => response.json())
      .then(data => {
        this.tasks = data;
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }

  handleInputChange(event, field) {
    this.newTask = { ...this.newTask, [field]: event.target.value };
  }

  handleEditInputChange(event, field) {
    this.editingTask = { ...this.editingTask, [field]: event.target.value };
  }

  addTask() {
    fetch('http://localhost:3000/tarea', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.newTask),
    })
      .then(() => {
        this.fetchTasks();
        this.newTask = { nombre: '', descripcion: '', estado: '' };
      })
      .catch(error => console.error('Error adding task:', error));
  }

  updateTask(id) {
    fetch(`http://localhost:3000/tarea/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.editingTask),
    })
      .then(() => {
        this.fetchTasks();
        this.editingTask = null;
      })
      .catch(error => console.error('Error updating task:', error));
  }

  deleteTask(id) {
    fetch(`http://localhost:3000/tarea/${id}`, { method: 'DELETE' })
      .then(() => this.fetchTasks())
      .catch(error => console.error('Error deleting task:', error));
  }

  render() {
    return (
      <div>
        <h1>Administrador de tareas</h1>

        <div>
          <h2>Añadir nueva tarea</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={this.newTask.nombre}
            onInput={event => this.handleInputChange(event, 'nombre')}
          />
          <input
            type="text"
            placeholder="Descripción"
            value={this.newTask.descripcion}
            onInput={event => this.handleInputChange(event, 'descripcion')}
          />
          <input
            type="text"
            placeholder="Estado"
            value={this.newTask.estado}
            onInput={event => this.handleInputChange(event, 'estado')}
          />
          <button onClick={() => this.addTask()}>Add Task</button>
        </div>

        <div>
          <h2>Tarea</h2>
          <ul>
            {this.tasks.map(task => (
              <li>
                {this.editingTask && this.editingTask.id === task.id ? (
                  <div>
                    <input
                      type="text"
                      value={this.editingTask.nombre}
                      onInput={event => this.handleEditInputChange(event, 'nombre')}
                    />
                    <input
                      type="text"
                      value={this.editingTask.descripcion}
                      onInput={event => this.handleEditInputChange(event, 'descripcion')}
                    />
                    <input
                      type="text"
                      value={this.editingTask.estado}
                      onInput={event => this.handleEditInputChange(event, 'estado')}
                    />
                    <button onClick={() => this.updateTask(task.id)}>Save</button>
                  </div>
                ) : (
                  <div>
                    <span>{task.nombre}</span>
                    <span>{task.descripcion}</span>
                    <span>{task.estado}</span>
                    <button onClick={() => (this.editingTask = task)}>Edit</button>
                    <button onClick={() => this.deleteTask(task.id)}>Delete</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
