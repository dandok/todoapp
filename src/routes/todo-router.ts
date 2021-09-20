import {Router} from 'express'
import { createTask, getAllTasks, updateTask, deleteTask } from '../controller/todo-controller'
import auth from '../middleware/auth'

const router = Router()

router.post('/todo', createTask)
// router.get('/todo', auth, gettask)
router.get('/todos', getAllTasks)
router.patch('/todo/:id', auth, updateTask)
router.delete('/todo/:id', auth, deleteTask)

export default router

