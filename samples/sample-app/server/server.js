const dotenv = require('dotenv');
const express = require('express');
const router = express.Router();
var cors = require('cors');
const app = express();
app.use(cors());

dotenv.config();

const uuid = require('uuid');
const crypto = require("crypto");

const privateKey = process.env.PRIVATE_KEY;

router.get("/auth", function(req, res) {
    var token = req.query.token || uuid.v4();
    var expire = req.query.expire || parseInt(Date.now()/1000)+2400;
    var privateAPIKey = `${privateKey}`;
    var signature = crypto.createHmac('sha1', privateAPIKey).update(token+expire).digest('hex');
    res.status(200);
    res.send({
        token : token,
        expire : expire,
        signature : signature
    });
});

app.use("/",router);

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
