import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/appIndex';
import User from '../src/models/user-schema';
import Todo from '../src/models/todo-schema';


const testTodo = {
  email: 'testemail@gmail.com',
  title: 'test title',
  description: 'test description',
  completed: false,
};
beforeEach(async () => {
  await Todo.deleteMany();
  await Todo.create(testTodo);
  // await new User(testUser).save()
});
afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.  
  mongoose.connection.close();
  done();
});


describe('To test todo endpoints', () => {
  test('should get all todos', async () => {
    await supertest(app).get('/todos').expect(302);
  });
  test('should create a new ', async () => {
    const data = {
      email: 'titleemail@gmail.com',
      title: 'new title',
      description: 'new description',
      completed: false
    };
    
    await supertest(app).post('/todo').send(data).expect(200);
  });
});