const mongoose= require('mongoose')
const db=async()=>{
    try {
        const conn= await mongoose.connect(process.env.CONNECTION)
        console.log(`database connected to ${conn.connection.host}`)
    } catch (error) {
        console.log(error.message)
    }
    
}
module.exports=db