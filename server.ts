import app from "./src/app";

import {config}  from './src/config/config';
import connectDB from './src/config/db';
const startServer = async () => {

    await connectDB();

    const port =  config.port || 3000;
    app.listen(port, ()=>{

        console.log(`listening in port :${port}`);
        console.log(`http://localhost:${port}`);
    });
 }

 startServer();