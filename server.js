const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // middleware
const http = require('http');
const cors = require('cors');
const session = require("express-session");
const cookieParser = require("cookie-parser");

const pool = require("../nodeapi/config/connection");
const mysql = require('mysql');
const responseCode = require("../nodeapi/constant/responseCode");

const port = 9000 // Port we will listen on

 
// Current date
const ts = Date.now();

const date_ob = new Date(ts);
const date = date_ob.getDate();
const month = date_ob.getMonth() + 1;
const year = date_ob.getFullYear();
const today = year + "-" + month + "-" + date;

// Middelware to intreact with react app
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser())
/* Set Cookie Settings */
app.use(
    session({
      key: 'user_sid',
      secret: 'secret2021',
      resave:false,
      saveUninitialized:true,
      cookie:{
            expires:new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
            httpOnly :true
        }
      
    })
  );

app.use((req,res,next)=>{
    console.log(req.session);
    if(req.session.user && req.cookies.user_sid){
        res.redirect('/');
    }
    next();

});

var sessionChecker =(req,res,next)=>{
    if(req.session.user && req.cookies.user_sid){
        res.redirect('/dashboard');
    }
}


  /*
    Purpose : Login API to check whether user exists or not
  */

  app.post('/login', (req, res) => {
    // Insert Login Code Here
    console.log(req.body);
    let loginid = req.body.userid;
    let name = req.body.username;
    
    if(loginid && name){
        let selectQuery = 'SELECT id,name FROM ?? WHERE ?? = ?  and ??=?';    
        let query = mysql.format(selectQuery,["users","loginId", loginid,"name", name]);
       
        pool.query(query,(err, data) => {
            if(err) {
                console.error(err);
                return;
            }
        // rows fetch
        console.log(data);
      if(data!= null  && data[0].id!='' )
      {
        responseCode.recordSuccessResponse(res,"errorResponse", data,"Some thing went wrong");
      }else{
        responseCode.recordSuccessResponse(res,"recordfound", data,"Login Successfully");
        }    
    });
    }
    else{
       
        responseCode.recordSuccessResponse(res,"requiredParamsMissing");
    }
    
    //res.send(`LoginId: ${loginid} Name: ${name} `);
  });

    /*
    Purpose : Add new task into database for particular user
    */

  app.post('/newtask', (req, res) => {
    let userid = req.body.userid;
    let task = req.body.task;
    
    if(userid && task){
        let selectQuery = 'INSERT INTO ?? (userId, task_name, status,created_date,updated_date) VALUES(?, ?, ?, ?, ?)';    
        let query = mysql.format(selectQuery,["task", userid, task,1,today,today]);
       
        pool.query(query,(err, data) => {
            if(err) {
                console.error(err);
                return;
            }
        // rows fetch
        
        if (data.affectedRows) {
            responseCode.recordSuccessResponse(res,"msg200", data,"Task Added Successfully");
          }else{
            responseCode.recordSuccessResponse(res,"errorResponse", data,"Some thing went wrong");
          }
        
        });
    }
    else{
       
        responseCode.recordSuccessResponse(res,"requiredParamsMissing");
    }
   
    });

    /*
    Purpose : List of all tasks for particular user
    */

    app.get('/alltask', (req, res) => {
        const loginid = req.query.userid;
        if(loginid){
            let selectQuery = 'SELECT id,task_name,status,created_date FROM ?? WHERE ?? = ? ';    
            let query = mysql.format(selectQuery,["task","userId", loginid]);
           
            pool.query(query,(err, data) => {
                if(err) {
                    console.error(err);
                    return;
                }
            // rows fetch
            console.log(data);
            responseCode.CustomResponse(res,"recordfound", data,"Record found successfully");
            });
        }
        else{
           
            responseCode.recordSuccessResponse(res,"requiredParamsMissing");
        }
        
    });
    
    /*
    Purpose : Get task details for particular task id
    */
    app.get('/gettask', (req, res) => {
        let loginid = req.query.userid;
        let taskid = req.query.taskid;
        
        if(loginid && taskid){
            let selectQuery = 'SELECT id,task_name,status,created_date FROM ?? WHERE ?? = ?  and ??=?';    
            let query = mysql.format(selectQuery,["task","userId", loginid,"id",taskid]);
           
            pool.query(query,(err, data) => {
                if(err) {
                    console.error(err);
                    return;
                }
            // rows fetch
            console.log(data);
            responseCode.recordSuccessResponse(res,"recordfound", data,"Record found successfully");
            });
        }
        else{
           
            responseCode.recordSuccessResponse(res,"requiredParamsMissing");
        }
    });

    /*
    Purpose : Get task details for particular task id
    */
    app.post('/updatetask', (req, res) => {
        let userid = req.body.userid;
        let taskid = req.body.taskid;
        let task = req.body.task;
        let taskstatus = req.body.taskstatus;
        
        if(userid && taskid){
            let selectQuery = 'UPDATE ?? SET task_name=?, status=?, updated_date=? WHERE id=?';    
            let query = mysql.format(selectQuery,["task", task, taskstatus,today,taskid]);
        
            pool.query(query,(err, data) => {
                if(err) {
                    console.error(err);
                    return;
                }
           console.log(data); 
            if (data.affectedRows) {
                responseCode.recordSuccessResponse(res,"updateRecord", data,"Task Updated Successfully");
            }else{
                responseCode.recordSuccessResponse(res,"errorResponse", data,"Some thing went wrong");
            }
            
            });
        }
        else{
        
            responseCode.recordSuccessResponse(res,"requiredParamsMissing");
        }
    });

    /*
    Purpose : Get task details for particular task id
    */
    app.post('/deletetask', (req, res) => {
        let userid = req.body.userid;
        let taskid = req.body.taskid;
        let taskstatus = req.body.taskstatus;
        
        if(userid && taskid){
            let selectQuery = 'UPDATE ?? SET status=?, updated_date=? WHERE id=?';    
            let query = mysql.format(selectQuery,["task", taskstatus,today,taskid]);
        
            pool.query(query,(err, data) => {
                if(err) {
                    console.error(err);
                    return;
                }
           console.log(data); 
            if (data.affectedRows) {
                responseCode.recordSuccessResponse(res,"deleteRecord", data,"Task Deleted Successfully");
            }else{
                responseCode.recordSuccessResponse(res,"errorResponse", data,"Some thing went wrong");
            }
            
            });
        }
        else{
        
            responseCode.recordSuccessResponse(res,"requiredParamsMissing");
        }
    });

    /*
    Purpose : Search task details for particular task id
    */
    app.get('/searchtask', (req, res) => {
        let userid = req.query.userid;
        let task = req.query.task;
        
        if(userid && task){
            let selectQuery = 'SELECT id,task_name,status,created_date FROM ?? WHERE task_name like "%'+task+'%"';    
            let query = mysql.format(selectQuery,["task"]);
        
            pool.query(query,(err, data) => {
                if(err) {
                    console.error(err);
                    return;
                }
           
            if (data.affectedRows) {
                responseCode.recordSuccessResponse(res,"recordfound", data,"Record Found Successfully");
            }else{
                responseCode.recordSuccessResponse(res,"noRecord", data,"No Record Found");
            }
            
            });
        }
        else{
        
            responseCode.recordSuccessResponse(res,"requiredParamsMissing");
        }
    });


// Function to listen on the port
//app.listen(port, () => console.log(`This app is listening on port ${port}`));

http.createServer(app).listen(port, function(){
    console.log('Express server listening on port ' + port);
   });