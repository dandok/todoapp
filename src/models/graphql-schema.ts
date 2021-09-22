import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLFloat,
  GraphQLID,
  GraphQLBoolean,
} from 'graphql';

import Todo from './todo-schema';
import User from './user-schema';

const userType = new GraphQLObjectType({
  name: 'User',
  description: 'Details of registered users',
  fields: () => ({
    name: {
      type: GraphQLString,
      description: 'Name of user',
    },
    email: {
      type: GraphQLString,
      description: 'Email address of user',
    },
    password: {
      type: GraphQLString,
      description: '',
    },
  }),
});

const todoType = new GraphQLObjectType({
  name: 'Todos',
  description: 'List of tasks to be done',
  fields: () => ({
    email: {
      type: GraphQLString,
      description: 'Email of user who created the task',
    },
    title: {
      type: GraphQLString,
      description: 'Title of todo',
    },
    description: {
      type: GraphQLString,
      description: 'Breakdown of task to be done',
    },
    completed: {
      type: GraphQLBoolean,
      description: 'A display of pending or completed tasks',
    },
  }),
});

const query = new GraphQLObjectType({
  name: 'RootQuery',
  description: 'The root query',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      description: 'list of registered users',
      resolve: () => {
        return User.find({});
      },
    },
    user: {
      type: userType,
      description: 'Display a single user',
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
          descripton: 'Name of user',
        },
      },
      resolve: (_, args) => {
        return User.findOne(args);
      },
    },
    todos: {
      type: new GraphQLList(todoType),
      description: 'List of tasks todo',
      resolve: () => {
        return Todo.find({});
      },
    },
    todo: {
      type: todoType,
      description: 'Single todo',
      args: {
        email: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve: (_, args) => {
        let todo = Todo.findOne(args);

        if (!todo) {
          return null;
        }
        return todo;
      },
    },
  }),
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Changes that can be made to this schema',
  fields: () => ({
    addUser: {
      type: userType,
      description: 'New user',
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Name of user to be added',
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Email of user to be added',
        },
        password: {
          type: new GraphQLNonNull(GraphQLString),
          description: '',
        },
      },
      resolve: (parent, args) => {
        let user = new User({
          name: args.name,
          email: args.email,
          password: args.password,
        });
        return user.save();
      },
    },
    updateUser: {
      type: userType,
      description: 'Update user details',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        name: {
          type: GraphQLString,
          description: 'Update name',
        },
        email: {
          type: GraphQLString,
          description: 'Update email',
        },
        password: {
          type: GraphQLString,
          description: 'Update password',
        },
      },
      resolve: async (parent, args) => {
        let user = await User.findById(args.id);

        if (!user) {
          return null;
        }
        user.name = args.name;
        user.email = args.email;
        return user.save();
      },
    },
    deleteUser: {
      type: userType,
      description: 'Delete user details',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (parent, args) => {
        let user = await User.findById(args.id);

        if (!user) {
          return null;
        }
        return user.remove()
      },
    },
    addTask: {
      type: todoType,
      description: 'New task',
      args: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Title of tasks to be added',
        },
        description: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Details of tasks to be added',
        },
        email: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Email of task created',
        }
      },
      resolve: (parent, {title, description, email}) => {
        let user = new Todo({
          title: title,
          description: description,
          email: email
        });
        return user.save();
      },
    },
    updateTask: {
      type: todoType,
      description: 'Update user tasks',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
          description: 'Id of task to be updated'
        },
        title: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Title of tasks to be added',
        },
        description: {
          type: new GraphQLNonNull(GraphQLString),
          description: 'Details of tasks to be added',
        }
      },
      resolve: async (parent, args) => {
        let task = await Todo.findById(args.id);

        if (!task) {
          return null;
        }
        task.name = args.title;
        task.description = args.description;
        return task.save();
      },
    },
    deleteTask: {
      type: userType,
      description: 'Delete task',
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (parent, args) => {
        let task = await Todo.findById(args.id);

        if (!task) {
          return null;
        }
        return task.remove()
      },
    },
  }),
});

export = new GraphQLSchema({
  query,
  mutation,
});
