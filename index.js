const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

const userAuth = require('./middlewares/userAuth')

const corsOptions = {
    origin: 'http://localhost:5174',
    credentials: true,

  };
  


app.use(cors(corsOptions));
app.use(express.json())
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))

app.post('/login',(req, res) => {
    const user = {
    id: 1,
    userName: 'ajith'
    };
    
    const accessToken = jwt.sign({ user }, 'rahul', { expiresIn: '1h' });
    const refreshToken = jwt.sign({ user }, 'rahul', { expiresIn: '1d' });

  
   
    res
    .cookie('refreshToken', refreshToken,{ httpOnly: true, })
    .header('authorization', accessToken)
    .json({
        status:'success',
        message: 'Login successful',
        data:{
            refreshToken:refreshToken,
            accessToken:accessToken
        }
      });
     
    });



    app.post('/refresh', (req, res) => {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
          return res.status(401).send('Access Denied. No refresh token provided.');
        }
      
        try {
          const decoded = jwt.verify(refreshToken, 'rahul');
          const accessToken = jwt.sign({ user: decoded.user }, 'rahul', { expiresIn: '1h' });
      
          res
            .header('authorization', accessToken)
            .json({
                status:'success',
                message: 'refreshing successful',
                data:{
                 accessToken:accessToken
                }
            })
        } catch (error) {
          return res.status(400).send('Invalid refresh token.');
        }
      });


      app.get('/authenticated', userAuth, (req, res) => {
        res.json({
            status:'success',
            message: 'authentication successful',
        });
      });
    

app.listen(2000,() =>{
    console.log("server listening on port 2000")
})