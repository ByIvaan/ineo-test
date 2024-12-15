const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

let tasks = [
  { id: 1, title: 'Create a landing page', description: 'Design and develop the landing page for the new product.', categoryId: 1 },
  { id: 2, title: 'Design logo', description: 'Create a logo that represents the brand.', categoryId: 1 },
  { id: 3, title: 'Write blog post', description: 'Write a blog post about the new product launch.', categoryId: 1 },
  { id: 4, title: 'Develop API', description: 'Develop the backend API for the application.', categoryId: 2 },
  { id: 5, title: 'Fix bugs', description: 'Identify and fix bugs in the application.', categoryId: 2 },
  { id: 6, title: 'Code review', description: 'Review the code written by team members.', categoryId: 2 },
  { id: 7, title: 'Deploy to production', description: 'Deploy the application to the production environment.', categoryId: 2 },
  { id: 8, title: 'Update documentation', description: 'Update the project documentation with the latest changes.', categoryId: 2 },
  { id: 9, title: 'User testing', description: 'Conduct user testing to gather feedback.', categoryId: 3 },
  { id: 10, title: 'Gather feedback', description: 'Collect feedback from users and stakeholders.', categoryId: 3 }
]
let categories = [
  { id: 1, name: 'To Do', color: '#FF7F50' },
  { id: 2, name: 'In Progress', color: '#32CD32' },
  { id: 3, name: 'Done', color: '#4169E1' }
]

app.use(express.json())
// cors
app.use(cors())

// get all tasks
app.get('/tasks', (req, res) => {
  setTimeout(() => {
    tasks.forEach(task => {
      task.category = categories.find(category => category.id === task.categoryId)
    })
    res.json(tasks)
  }, 300);
})

// create a new task
app.post('/tasks', (req, res) => {
  const task = req.body
  task.id = tasks.length + 1
  console.log("Creating task", task)
  tasks.push(task)
  res.json(task)
})

// update a task
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = req.body
  const taskIndex = tasks.findIndex(task => task.id === id)
  console.log("Updating task", task)
  tasks[taskIndex] = task
  res.json(task)
})

// delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id)
  tasks.splice(taskIndex, 1)
  res.json({ id })
})

app.get('/categories', (req, res) => {
  setTimeout(() => {
    res.json(categories)
  }, 300);
})

app.post('/categories', (req, res) => {
  const category = req.body
  category.id = categories.length + 1
  categories.push(category)
  res.json(category)
})

app.put('/categories/:id', (req, res) => {
  const id = Number(req.params.id);
  const category = req.body
  const categoryIndex = categories.findIndex(category => category.id === id)
  categories[categoryIndex] = category
  res.json(category)
})

app.delete('/categories/:id', (req, res) => {
  const id = Number(req.params.id);
  // delete tasks in the category
  tasks = tasks.filter(task => task.categoryId !== id)
  const categoryIndex = categories.findIndex(category => category.id === id)
  categories.splice(categoryIndex, 1)
  res.json({ id })
})

app.get('/categories/:id/tasks', (req, res) => {
  const id = Number(req.params.id);
  console.log("Getting tasks for category", id)
  setTimeout(() => {
    const tasksByCategory = tasks.filter(task => task.categoryId === id)
    tasksByCategory.forEach(task => {
      task.category = categories.find(category => category.id === task.categoryId)
    })
    res.json(tasksByCategory)
  }, 300);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})