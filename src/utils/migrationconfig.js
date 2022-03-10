module.exports = {
    type:'postgres',
    url:process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV !== 'development',
    extra:process.env.NODE_ENV !== 'development'?{
        ssl:{
            rejectUnauthorized: false
        }
    }:undefined,
    migrations:['src/migrations/*.ts'],
    cli:{
        migrationsDir: "src/migrations"
    },
    entities:[
        "src/models/*.ts",
        "src/models/*.js"
    ],
}