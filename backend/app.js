const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const serverless=require('serverless-http');
const router=express.Router();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://satyamrau9721:F5s1wFUB35apNzdC@admin.zzp9cix.mongodb.net/Land?retryWrites=true&w=majority'; // Replace with your MongoDB connection URI and Database name is Land and collecction would be submissions
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); // Replace with your MongoDB connection URI and Database name is Land and collecction would be submissions mongodb://0.0.0.0:27017/Land
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Submission = mongoose.model('Submission', {
  fullName: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contactNo: String,
  message: String,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});



app.post('/register', async (req, res) => {
    const { fullName, email, contactNo, message } = req.body;
  
    // Validate contact number (must be exactly 10 digits)
    if (contactNo.length !== 10 || isNaN(contactNo)) {
      return res.status(400).json({ message: 'Contact number must be a valid 10-digit number' });
    } 
    let user = await Submission.findOne({ email: req.body.email })

    if (user) {
        return res.status(400).json({ message: 'This email already exits' });
    }else{
        try {
            const submission = new Submission({
              fullName,
              email,
              contactNo,
              message,
            });
        
            await submission.save();
            res.status(201).json({ message: 'You have been added to the waiting list' });
          } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
          }
    }
   
  });
  

app.get('/customers', async (req, res) => {
  try {
    const submissions = await Submission.find();
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'customers' });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});