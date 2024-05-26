import express from 'express'; // Webserver
import open from 'open'; // Allows for opening links
import path from 'path';
import { fileURLToPath } from 'url';
import expressLayouts from 'express-ejs-layouts';

// Set dir name (not available in ES modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000; // Port can be whatever really

// This means files in the 'public' directory are avaiable
app.use(express.static(path.resolve(__dirname, 'src')));
app.use(expressLayouts);

// Use EJS as the view engine (view engine controls having similar stuff between pages)
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Define routes for different pages
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

app.get('/portfolio', (req, res) => {
  res.render('portfolio', { title: 'Portfolio' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  open(`http://localhost:${port}`);
});