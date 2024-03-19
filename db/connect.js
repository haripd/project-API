const  mongoose = require('mongoose')

const dbConnect = async() => {
    if(process.env.MODE === "development"){
        await mongoose.connect(process.env.MONGO_DEV)
        .then( res => {
            console.log(`local mongodb connected`)
        }).catch(err => console.log(err.message))
    }

    if(process.env.MODE === "production"){
        await mongoose.connect(process.env.MONGO_URL)
        .then( res => {
            console.log(`Cloud mongodb is connected`)
        }).catch(err => console.log(err.message))
    }
}
module.exports = dbConnect