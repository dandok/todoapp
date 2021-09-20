import { connect } from 'mongoose';

const connectionURL = 'mongodb://127.0.0.1:27017/mytodo-test';

export async function run(): Promise<void> {
  await connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('connected'))
    .catch(() => console.log('not connected'));
}
