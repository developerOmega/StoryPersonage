import express = require('express');
import path = require('path');
// import bodyParser = require('body-parser');

export default class Server {
    public app: express.Application;
    public port: string;

    constructor(port: string){
        this.port = port;
        this.app = express();
    }

    static init( port: string ){
        return new Server( port );
    }

    private publicFolder(){
        const publicPath = path.resolve(__dirname, '../public');
        this.app.use(express.static( publicPath ));
    }

    // private bodyParser(){
    //     this.app.use(bodyParser.urlencoded({ extended: false }));
    //     this.app.use(bodyParser.json());
    // }

    public start(callback: Function){
        this.app.listen(this.port, callback());
        this.publicFolder();
        // this.bodyParser();
    }
}