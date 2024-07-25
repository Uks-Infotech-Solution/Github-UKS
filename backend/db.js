const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.connect('mongodb://LDp-DB:d888833d093ksKdmc@148.251.230.14:27017/LDp-DB', )
  
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch((err) =>{
    console.log(err);
    console.log("Error to connect MongoDB",err);
})
};

module.exports = connectDB;
