module.exports = {
    type:'postgres',
    url:process.env.DATABASE_URL,
    migrations:['src/migrations/*.ts'],
    cli:{
        migrationsDir: "src/migrations"
    },
    entities:[
        "src/models/*.ts",
        "src/models/*.js"
    ],
}