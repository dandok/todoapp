import { Request, Response } from 'express';
import Todo from '../models/todo-schema';
import User, { DataDocument } from '../models/user-schema';

export const homePage = async (req: Request, res: Response) => {
  res.render('index', { title: "Dokubo's Todo App" });
};

export const registrationPage = async (req: Request, res: Response) => {
  res.render('registration', { title: "Dokubo's Todo App" });
};

export const signinPage = async (req: Request, res: Response) => {
  res.render('signin', { title: "Dokubo's Todo App" });
};

export const createUser = async (req: Request, res: Response) => {
  const user = new User(req.body);
  const userEmail = req.body.email;

  try {
    const email = await User.findOne({ email: userEmail });
    if (!email) {
      const newUser = await user.save();
      const token = await user.generateAuthToken();
      res.cookie('token', token);
      res.send({ newUser, token });
      return;
    }
    res
      .status(404)
      .send({ message: 'email already exists, kindly use another email' });
  } catch (e: any) {
    res.status(404).send({ message: e.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.cookie('token', token);
    res.send({ user, token });
  } catch (e:any) {
    res.status(400).send({ message: e.message });
  }
};

// export const viewProfile = async (req: Request, res: Response) => {
//   res.send(req.user);
// };

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User does not exist');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.password = req.body.pasword || user.password;
    //find a way to loop through

    await user.save();
    res.send(user);
  } catch (e) {
    res.send(404).send();
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // req.user.tokens = req.user.tokens.filter((token) => {
    //   return token !== (req.token as unknown);
    // });
    res.clearCookie('jwt')//find out bout log out
    // await req.user.save();
    res.redirect('/')
    // res.send();
  } catch (e) {
    res.status(404).send();
  }
};

// export const logoutAll = async (req: Request, res: Response) => {
//   try {
//     req.user.tokens = [];
//     await req.user.save();

//     res.send();
//   } catch (e) {
//     res.status(404).send({ error: 'Error' });
//   }
// };

export const deleteUser = async (req: Request, res: Response) => {
  const me = req.user;
  try {
    await me.remove();
    res.send(me);
  } catch (e) {
    res.status(404).send();
  }
};
