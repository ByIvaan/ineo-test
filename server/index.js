const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

const tasks = []
const categories = []

app.use(express.json())
// cors
app.use(cors())

// get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks)
})

// create a new task
app.post('/tasks', (req, res) => {
  const task = req.body
  task.id = tasks.length + 1
  tasks.push(task)
  res.json(task)
})

// update a task
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id
  const task = req.body
  const taskIndex = tasks.findIndex(task => task.id === id)
  tasks[taskIndex] = task
  res.json(task)
})

// delete a task
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id
  const taskIndex = tasks.findIndex(task => task.id === id)
  tasks.splice(taskIndex, 1)
  res.json({ id })
})

app.get('/categories', (req, res) => {
  res.json(categories)
})

app.post('/categories', (req, res) => {
  const category = req.body
  category.id = categories.length + 1
  categories.push(category)
  res.json(category)
})

app.put('/categories/:id', (req, res) => {
  const id = req.params.id
  const category = req.body
  const categoryIndex = categories.findIndex(category => category.id === id)
  categories[categoryIndex] = category
  res.json(category)
})

app.delete('/categories/:id', (req, res) => {
  const id = req.params.id
  const categoryIndex = categories.findIndex(category => category.id === id)
  categories.splice(categoryIndex, 1)
  res.json({ id })
})

app.get('/categories/:id/tasks', (req, res) => {
  const id = req.params.id
  const tasksByCategory = tasks.filter(task => task.categoryId === id)
  res.json(tasksByCategory)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})