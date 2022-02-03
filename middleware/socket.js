const jwt  = require('jsonwebtoken');
const keys = require('../config/keys');
const User = require('../model/User');

const getUser = async (userID) =>{
    const user =  await User.findOne({_id: userID}, {password: 0})
    return{
        _id: user._id ?  user._id : '',
        firstname: user.firstname ? user.firstname : '',
        lastname: user.lastname ? user.lastname : '',
        avatar: user.avatar ? getImageFromS3(user.avatar, 'gsa-profile-image') : '' ,
    }
}


const saveMesg = async (payload) =>{
    const message = Message({
    room: payload.room,
    author: payload.author,
    body: payload.body,
    createAt: payload.createAt
    })

    await message.save()
    return message
}


module.exports  =  (app, io, user) =>{
   
    io.on('connection', async (socket) => {;
        const auth = socket.handshake.auth.token
        
        const socketID = []

        if(auth){
            const bear = auth.split(' ')[0]
            const token = auth.split(' ')[1];
            if(bear !== 'Bearer'){
                socket.on('disconnect', () =>{
                    console.log('disconnect');
                })
            }
    
            try {
    
                const check  = jwt.verify(token, keys.secretOrKey)
                
                if(!check){
                    socket.on('disconnect', () =>{
                        console.log('disconnect');
                    })
                }
         
                //const user  = await getUser(check.id)
                //const school = await User.findById({_id: check.id}, {school: 1, _id: 0})
                socket.on('message', payload =>{
                    io.to(socket.id).emit("message", payload)
                })
                const school = socket.handshake.auth.school



                socket.on(school, payload =>{
                    const msg = saveMesg(payload)
                    io.emit(school, msg)
                    //socket.broadcast.to(school).emit(payload)
                })

                socket.on('GSA', payload =>{   
                    const msg = saveMesg(payload)
                    io.emit('GSA', payload)
                    //socket.broadcast.to('GSA').emit(payload)
                })
            
            } catch (error) {
                socket.on('disconnect', () =>{
                    console.log('disconnect');
                })
            }
        }
       
    })
}