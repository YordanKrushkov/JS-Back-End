const config = require('./config.json');
const http = require('http');
const url = require('url');
const path=require('path');
const fs=require('fs');


const VIEWS_PATH=path.resolve(config.viewsDir);
const STATIC_FILES_PATH=path.resolve(config.staticFileDir);

const routFileMap = {
    '/': 'home/index.html',
    '/addBreed': '/addBreed.html',
    '/addCat': '/addCat.html',
}
const mimeTypeMap={
    '.html':'text/html',
    '.css': 'text/css',
    '.js':'application/javascript',
    '.json': 'application/json'
}

function sendFile(res, fullFilePath){
    const fileExt=path.extname(fullFilePath);
    const type=mimeTypeMap[fileExt];
 fs.readFile(fullFilePath, function(err, data){
     if(err){
         let {message}=err;
        res.writeHead(500, {
            'Content-length':Buffer.byteLength(message),
            'Content-Type': 'text/plain'
        }).end(message);
        return;
     };
     res.writeHead(200, {
        'Content-length':Buffer.byteLength(data),
        'Content-Type': type || 'text/html'
    }).end(data)

 })
}

function httpHandler(req, res){
    const pathname = url.parse(req.url).pathname;

    if (pathname.includes(`/${config.staticFileDir}/`)){
        const fullStaticFilePath=path.resolve(pathname.slice(1));
        sendFile(res, fullStaticFilePath);
        return;
    }

    const fileRelativePath=routFileMap[pathname]

    if(!fileRelativePath){
        const data='Not Found'
        res.writeHead(404, {
            'Content-length':Buffer.byteLength(data),
            'Content-Type': 'text/plain'
        }).end(data)
        return;
    }
 const fullFilePath= path.join(VIEWS_PATH, fileRelativePath);
    sendFile(res, fullFilePath);
}

http.createServer(httpHandler).listen(config.port, function () {
    console.log(`Server is listening on ${config.port}`)
})