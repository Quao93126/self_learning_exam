import http, { request } from 'http';
/**
 * NodeJs is not written in typescript, it doesn't have any information of type
 * In order to have to know the typescript, we have to install type explicitly for that.
 * npm i -D @types/node -> @types/(name of the project)
 */

http
.createServer((request, response)=>{
    response.end('hello World, again!');
}).listen(8080, ()=> console.log(`App is started on PORT 8080...`)
)

/**
 * we are using pm2 tool in dev-dependency to have re-build app.js just like nodemon.
 */