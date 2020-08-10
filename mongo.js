const mongoose = require('mongoose');
mongoose.set('debug', true);
const mongolink = `mongodb+srv://${process.env.MONGO_LOGIN}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_LINK}`

mongoose.connect(mongolink , 
  {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
  });
  
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to DB.');
});