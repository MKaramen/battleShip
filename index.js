const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static('public'))

app.listen(3000, () => {
    console.log("Listening 3000");
});

app.post('/position', (req, res) => {
    const data = req.body;
    res.json({
        kek: data
    })
});