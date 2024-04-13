import express from 'express'; // Webserver
import open from 'open'; // Allows for opening links

const app = express();
const port = 3000; // Port can be whatever really

// This means files in the 'public' directory are avaiable
app.use(express.static('src'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  open(`http://localhost:${port}`);
});