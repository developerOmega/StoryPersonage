//====================================
// Puerto
//====================================

const port:string = process.env.PORT || '3000';

//====================================
// Entorno
//====================================

const nodeEnv:string = process.env.NODE_ENV || 'development';

//====================================
// JSON WEB TOKEN
//====================================

class JsonEnv {
    public static expiredToken:string = '48h';
    public static seed:any = nodeEnv === 'development' ? 'el-gato-esta-en-desarrollo' : process.env.SEED;  
}

//====================================
// BASE DE DATOS
//====================================

class DatabaseEnv {
    public static host:any = nodeEnv === 'development' ? 'localhost' : process.env.HOST ;
    public static user:any = nodeEnv === 'development' ? 'root' : process.env.USER;
    public static password:any = nodeEnv === 'development' ? '1234': process.env.PASSWROD;
    public static database:any = nodeEnv === 'development' ? 'story_personage' : process.env.DATABASE;
}

export { port, nodeEnv, JsonEnv, DatabaseEnv };


