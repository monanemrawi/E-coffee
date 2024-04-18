const port = process.env.PORT;
const express = require('express');
const cors = require('cors');
require('./db/mongoose')
const productrouter = require('./routers/product');

const app = express();

app.use(express.json());
app.use(cors());
app.use(productrouter)

app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
