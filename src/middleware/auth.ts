import {Request, Response, NextFunction} from 'express'
import jwt from 'jsonwebtoken'
import User, {DataDocument} from '../models/user-schema'
import Todo from '../models/todo-schema'


declare global {
  namespace Express {
    interface Request {
      user: DataDocument
      token?: string
      tokens?:string
      task: DataDocument
    }
  }
}

interface Data {
  _id: string;
  // token: string
}

const auth = async function (req: Request, res: Response, next: NextFunction) {
  try{
    const secret = process.env.SECRET_KEY as string
    
    const token = req.header('Authorization')?.replace('Bearer ', '')
    const decoded = jwt.verify(token as string, secret) as unknown as Data
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token})
    const task = await Todo.findOne({_id: req.params.id})

    if(!user){
      throw new Error()
    }

    req.token = token 
    req.user = user
    req.task = task

    next()
  }catch(e){
    res.status(401).send({ error: 'Please authenticate.' })
  }
}

export = auth