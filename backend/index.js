const config = require('./utils/config')
const app = require('./app')
const PORT = config.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`server running on ${PORT}`);
})
