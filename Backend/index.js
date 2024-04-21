const port = process.env.PORT;
const express = require('express');
const cors = require('cors');
require('./db/mongoose')
const productRouter = require('./routers/product');
const userRouter = require('./routers/users')


const app = express();

app.use(express.json());
app.use(cors());
app.use(productRouter)
app.use(userRouter)

app.listen(port, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is up on port ${port}`);
});
