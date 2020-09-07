#apirev

This is my journey of visiting the apis through expressJS and I have followed [academind tutorials](https://www.youtube.com/playlist?list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q) with extra features of mine like the forgot password route which I used. This project covers mongoDB ATLAS, and authentication and route protection using JWT. Simple to test on POSTMAN.

clone the repository and make a mongoDB account and try ATLAS, the online database of mongoDB. Just need to paste the mongoDB cluster password in nodemon.json file that you have to create in the express folder. the format in the nodemon.json file is as follows

{ "env" : { "MONGO_ATLAS_PW" : "password", "JWT_KEY": "password" } } then open terminal in the express folder and run npm start

open POSTMAN and make a new request to http://localhost:5000/{route} available routes are: product orders user/login user/signup user/forgot

Cheers
