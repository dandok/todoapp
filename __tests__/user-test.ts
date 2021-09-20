import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../src/appIndex';
import User from '../src/models/user-schema';



const testUser = {
  name: 'dokubodaniel@gmail.com',
  email: 'test title',
  password: 'test description',
};
beforeEach(async () => {
  await User.deleteMany();
  await User.create(testUser);
  // await new User(testUser).save()
});
afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.  
  mongoose.connection.close();
  done();
});


describe('To test todo endpoints', () => {
  // test('should get all todos', async () => {
  //   await supertest(app).get('/user').expect(302);
  // });
  test('should create a new user', async () => {
    const data = {
      name: 'Testing',
      email: 'dokubodaniel@gmail.com',
      password: 'dandok609',
    };
    
    await supertest(app).post('/user').send(data).expect(200);
  });
});