const path= require('path')
const express= require('express')
const multer= require('multer')
const {updateProfilepic}=require('../controllers/userController')
const {isLogin}=require('../Middleware/authMiddleware')

const router=express.Router()

const storage= multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/')
    },
    filename(req, file,cb){
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file, cb){
    const filetypes= /jpg|jpeg|png/;
    const extname= filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype= filetypes.test(file.mimetype)
    if(extname && mimetype){
        return cb(null, true)
    } else{
        cb('Image only')}
}

const upload= multer({
    storage,
})

router.post('/',isLogin, upload.single('image'),updateProfilepic )

module.exports= router