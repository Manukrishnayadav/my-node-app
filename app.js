const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World from Node.js CI/CD app!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
