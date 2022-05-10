const express = require('express')
const multer = require('multer')
const s3 = require('../../s3')

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        console.log(true)
        cb(null, true)
    }else{
        //reject a file
        console.log(false)
        cb(null, false)
    }
    
}
const upload = multer({storage : storage, 
    limits : {
        fileSize : 1024 * 1024 * 10 // limit file to 10mb
    },
    fileFilter : fileFilter
})

const router = express.Router()

const {userAuthenticator, checkIsEmpty, validateCreateEventData} = require('../lib/index')
const {createEvent, deleteEvent, getAllEvents, getOneEvent} = require('./controller/eventController')

router.get('/', getAllEvents)
router.post('/upload', userAuthenticator ,upload.single('image'), 
function(req, res, next){
    try{
        res.send({
            message: 'success'
        })
    }catch(e){
        console.log(e.message)
        res.status(500).json({
            error: "error"
        })
    }
})
router.post('/create-event', userAuthenticator, checkIsEmpty, validateCreateEventData, createEvent)
router.delete('/delete-event/:id', userAuthenticator, deleteEvent)
router.get('/get-event/:id', getOneEvent)
router.get('/s3url', async (req, res) => {
    const url = await s3.generateUploadURL()
    res.send({url})
})

module.exports = router;

