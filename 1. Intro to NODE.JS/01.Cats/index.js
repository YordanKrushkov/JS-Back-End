const http=require('http');
const port=3000;

http.createServer(function(req,res){
 res.writeHead(200,{
     'Content-Type': 'text/plain'
 });
 res.write('Hello JS World');
 res.end();
})