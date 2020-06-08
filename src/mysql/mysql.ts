import mysql = require('mysql');
import { DatabaseEnv } from '../config/config';

export default class MySQL {
    private static __instance: MySQL;

    connection: mysql.Connection;
    connected: Boolean = false;

    constructor(){

        this.connection = mysql.createConnection({
            host: DatabaseEnv.host,
            user: DatabaseEnv.user,
            password: DatabaseEnv.password,
            database: DatabaseEnv.database
        });

        this.connectDB();

    }

    public static get instance(){
        return this.__instance || ( this.__instance = new this() );
    }

    static getQuery( query: string, callback: Function ){
        
        this.instance.connection.query(query, (err, results: Object[], fields) => {
            if(err){
                console.log('Error en query');
                console.log(err);
                return callback(err);
            }

            if( results.length === 0 ){
                return callback ('No existe el registro solicitado');
            }

            callback( null, results );
        } );
        
    }

    static postQuery( query: string, post: Object, callback: Function ){
        this.instance.connection.query(query, post, ( err, results: any, fields) => {
            
            if(err){
                console.log( 'Error en query' );
                console.log(err);
                return callback(err);
            }

            if(!results){
                return callback ('No se puede crear el registro');
            }


            return callback(null, results);
            
        })
    }

    static updateQuery( query: string, update: any, callback: Function ){

        this.instance.connection.query( query, update, ( err, results: any, fields ) => {
            
            if(err){
                console.log('Error en query');
                console.log(err);
                return callback(err);
            }

            if(!results){
                return callback ('No se puede editar el registro');
            }

            return callback(null, results);


        } )
    }

    static deleteQuery(query: string, callback: Function){
        this.instance.connection.query( query, (err, results: Object, fields) => {
            if(err){
                console.log('Error en el query');
                console.log(err);
                return callback(err);
            }

            if(!results){
                return callback('No se puede eliminar el registro');
            }

            callback(null, results);
        } )
    }

    private connectDB(){
        this.connection.connect( (err: mysql.MysqlError) => {
            if(err){
                console.log(err);
                return;
            }

            this.connected = true;
            console.log('Base de datos ONLINE');
        } )
    }


}
