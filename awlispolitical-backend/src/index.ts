// Very poor backend

// Import needed modules
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import { body, validationResult } from 'express-validator';

const DB_URI:string = 'mongodb://127.0.0.1/political-simulator';

// Create an APP
const app = express();

app.use(express.json()); // Parse incoming JSON data

// Connect to MongoDB
mongoose.connect(DB_URI).then(
  () => { 
    // TODO
  },
).catch((err: Error) => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err)
  process.exit();
})

const db = mongoose.connection;
db.once('open', function() {
  console.log('Connected to MongoDB');
});

// Define Party schema
const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    required: true
  }
});

// Create Party model
const Party = mongoose.model('Party', partySchema);

app.post('/create-party', 
  body('name').isString(),
  body('color').isHexColor(),
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

  const { name, color } = req.body;
  const newParty = new Party({ name, color });
  newParty.save((err, party) => {
    if (err) {
      res.status(500).json({ message: 'Error creating party' });
    } else {
      res.status(201).json({ message: 'Party created successfully', party });
    }
  });
});

app.post('/vote/:name', (req: express.Request, res: express.Response) => {
  // TODO
  const { name } = req.params;
});

app.get('/party/:name', (req: express.Request, res: express.Response) => {
  const { name } = req.params;
  Party.findOne({ name }, (err, party) => {
    if (err) {
      res.status(500).json({ message: 'Error finding party' });
    } else if (!party) {
      res.status(404).json({ message: 'Party not found' });
    } else {
      res.json({ party });
    }
  });
});

// Use Morgan to log incoming requests
app.use(morgan('combined'));

// Listen!
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
