const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/pomodoro', (req, res) => {
  res.json({ message: 'Pomodoro Time!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
