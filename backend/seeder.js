const mongoose= require('mongoose')
const colors=require('colors')
const dotenv=require('dotenv')
const Chat= require('./Modals/chatModal')
const User=require('./Modals/userModel')
const chats=require('./data/Chats')
const users=require('./data/Users')
const connectDB=require('./Config/db')
const Message = require('./Modals/messageModal')

// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import colors from 'colors';
// import users from './data/users.js';

// import data from './data.js'
// import connectDB from './Config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
  

    // const createdUsers = await User.insertMany(users);

    // const adminUser = createdUsers[0]._id;

    // const sampleProducts = products.map((product) => {
    //   return { ...product, user: adminUser };
    // });

    await User.insertMany(users);

    console.log('Data Imported!'.green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Message.deleteMany();
    // await Product.deleteMany();
    // await User.deleteMany();

    console.log('Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error){
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}