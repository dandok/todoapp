import { Request, Response } from 'express';
import Todo from '../models/todo-schema';
import jwt from 'jsonwebtoken'
import User, {DataDocument} from '../models/user-schema'

export const createTask = async (req: Request, res: Response) => {
  try {
    const task = new Todo({ 
      email: "caleb@gmail.com",
      title: req.body.title,
      description: req.body.description
    });
    const newTask = await task.save();
    console.log(task)
    res.send(newTask);
  } catch (e: any) {
    console.log(e.message)
    res.status(400).send();
  }
};

// export const gettask = async (req: Request, res: Response) => {
//   const _id = req.params.id
//   const title = req.body.title 
//   try {
//     const task = await Todo.findOne({ title });

//     if (!task) {
//       return res.status(404).send('Task does not exist');
//     }
//     res.send(task);
//   } catch (e) {
//     res.status(500).send()
//   }
// };

export const getAllTasks = async (req: Request, res: Response) => {
  if (!req.cookies.token) return res.redirect('/')//put this in auth.ts
  try {
    const secret = process.env.SECRET_KEY as string
    const decoded = jwt.verify(req.cookies.token as string, secret) as {[key: string]: string}
    const user = await User.findById(decoded._id) as unknown as {[key: string]: string| string[]}
    const tasks = await Todo.find({email: user.email}).sort({completed: false});
    
    res.render('todos', {
      title: "Dokubo's Todo App",
      name: user.name,
      todos: tasks,
      error:null
    });
  } catch (e) {
    res.redirect('/');
  }
};

export const updateTask = async (req: Request, res: Response) => {
  // const arr =  Object.keys(req.body)
  // const update = []
  // const task = 
  try{
    const id = req.params.id
    const task = await Todo.findById(id)

    if(!task){
      return res.status(400).send('Task does not exist')
    }
    console.log(req.body.completed)
    task.email = task.email
    task.title = req.body.title || task.title
    task.description = req.body.description || task.description
    task.completed = req.body.completed
    
    await task.save()
    res.send(task)
  }catch(e){
    console.log(e)
    res.status(400).send()
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const task = req.task
  try{
   await task.remove()
   res.send(task)
  }catch(e){
    res.status(404).send()
  }
}
