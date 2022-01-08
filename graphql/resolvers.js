const User = require('../model/User');
const Verify = require('../model/Verify')
const PostText = require('../model/postText');
const Comments = require('../model/comment');
const PostImage = require('../model/postImage');
const keys = require('../config/keys')
const bcrypt =  require('bcryptjs')
const jwt =  require('jsonwebtoken');
const { Error } = require('mongoose');
const nodemailer = require("nodemailer");
const AWS = require('aws-sdk');
// return all post owned by  a user in the User document (Table)
// Required user ID 
// PostImage && PostText is returned


//GENERATE RANDOM CODE
const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    // return dateString + randomness;
};

// uniqueId()


//validate Email
const validate = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return expression.test(String(email).toLowerCase())
}

const commentLen =  async owner =>{
    const len = await Comments.find({post: owner}).count()

    return len
}

const Posts = async owner =>{
    // owner == user ID from the User Document (Table)
    try {
        const postImages = await PostImage.find({owner: owner})
        const postText =  await PostText.find({owner: owner})

        // concatinate PostImage && PostText array of object
        const newData = postImages.concat(postText)

        // sort it by new to onld by the post Date
        const sorted = await newData.sort((a, b) => b.date - a.date);

        return sorted.map(post => {
            let image = post.imageAlbum
            return{
                _id: post._id,
                ...post._doc,  
                date: new Date(post._doc.date).toDateString(),
                imageAlbum: [image  ? getImageFromS3(image[0], 'gsa-image-store') : null],
                commnets: commentLen.bind(this, post._id),
                owner:    user.bind(this, post.owner),
                likes: likes.bind(this, post.likes)
            }
        })
    } catch (error) {
        throw error
    }
}

const likes = async (idArr) =>{
    const users = []
    for(let i = 0; i < idArr.length; i++){
        const likes = await User.findOne({_id: idArr[i]},{password: 0})
        if(likes){
            users.push(likes)
        }
    }

    return users.map(user =>{
        return{
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar ? getImageFromS3(user.avatar, 'gsa-profile-image') : '' ,
            school: user.school,
            password: null
        }
    })
}

// return all comments that is acosiated to a post.
// must provide the the post _id
const comments =  async owner =>{
    
    try {
        const comments = await Comments.find({post: owner})
        return comments.map(async comment =>{
            return{
                ...comment._doc,
                _id: comment._id,  
                date: new Date(comment._doc.date).toDateString(),
                //user is a function
                // Required User ID it return user information
                // Return firstName, Lastname, school, email, Avatar
                byUser: await user.bind(this, comment.byUser)
            }
        })
    } catch (error) {
        throw error
    }
}

const sendMailCode = async (accountExist, newCode) =>{

       
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
            user: keys.email, // generated ethereal user
            pass: keys.code, // generated ethereal password
            },
        });
     
        // send mail with defined transport object
        await transporter.sendMail({
            from: '"GSA PORTAL 🇬🇳 " <blessmuss@gmail.com>', // sender address
            to: `${accountExist.email}`, // list of receivers
            subject: "GSA PORTAL 🇬🇳", // Subject line
            text: "Hello New User 🤗", // plain text body
            html: `<b>Hello ${accountExist.firstname}</b>
                    <div> 
                        <p>Pleace verify your email address</p>
                        <p>your security code is= ${newCode}</p>
                        <p>the Code will expire in 10 munite</p>
                    </div>`, // html body
        });
        let success  = true
        return  success
}

const sendMailFun = async (id) =>{
        const accountExist = await User.findOne({_id: id}, {password: 0})
       
        if(!accountExist){
            throw new Error("Email doest not existed")
        }

        const newCode =  'code1'
        const verifyExist = await Verify.findOne({user: id})
        if(!verifyExist){
            const verify = new Verify({
                user: accountExist._id,
                code: newCode
            })
            await verify.save()
        }else{
            verifyExist.code = newCode
            await verifyExist.save()
        }
        
        const send = sendMailCode(accountExist, newCode)
       
        return send
}

const getImageFromS3  = async (key, from) =>{
    const s3 = new AWS.S3({
        accessKeyId: keys.accessKey,
        secretAccessKey: keys.secretKey,
        Bucket: from,
        region: keys.region
    });

    const avatar = await s3.getSignedUrl("getObject",{
        Bucket: from,
        Key: key,
        Expires: 3600*120
    })

    return avatar
}

const getUser = async (searhName) =>{
    const users = await User.aggregate([{
                
        "$search":{
            "index": "default",
            "text": {
                "query": `${searhName}`,
                "path": ["firstname", "lastname"],
                
            },
             
        },
        
    }])
    return users
}

//return a single user by providing the User ID
//Password must b set to Null when returning data from the User Document 
const user = async userId =>{
    try {

        const user =  await User.findOne({_id: userId}, {password: 0})
        return{
            _id: user._id ?  user._id : '',
            firstname: user.firstname ? user.firstname : '',
            lastname: user.lastname ? user.lastname : '',
            avatar: user.avatar ? getImageFromS3(user.avatar, 'gsa-profile-image') : '' ,
            school: user.school ? user.school : '',
            email: user.email ? user.email : '',
            major: user.major ? user.major : ''
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}

const resolvers = {
    //save User Image Profile (Avatar)
    profileImage: async (args, req) =>{
        //determine if a User is authanicated or not
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            // data type must be String not an object
            const old_avatar  = await User.findOne({_id: req.userID}, {avatar: 1})
            const new_avatr =  args.input.image


            const s3 = new AWS.S3({
                accessKeyId: keys.accessKey,
                secretAccessKey: keys.secretKey,
                Bucket: keys.bucketProfile,
                region: keys.region
            });
            
            if(old_avatar.avatar){
                const params = {
                    Bucket: keys.bucketProfile,
                    Key: old_avatar.avatar
                }

                s3.deleteObject(params, (error, data) =>{
                    if(error) throw error
                })
            }
            await User.updateOne({_id: req.userID}, {$set:{ "avatar": new_avatr}})
            return{
                success: true
            }
        } catch (error) {
            throw error
        }
    },

    allPost: async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            } 
            const authID = req.userID 
            const imagePost =  await PostImage.find({$query: {},$orderby: {date: 1}});
            const textPost =  await PostText.find({$query: {},$orderby: {date: 1}});
            
            //concatenate  image and text posts
            const newData = imagePost.concat(textPost);
            //sort by by post date
            const sorted = await newData.sort((a, b) => b.date - a.date);
          
            return sorted.map(post =>{
                let image = post.imageAlbum
                return{
                    _id: post._id,
                    ...post._doc,
                    date: new Date(post._doc.date).toDateString(),
                    owner: user.bind(this, post.owner),
                    imageAlbum: [image  ? getImageFromS3(image[0], 'gsa-image-store') : null],
                    commnets: commentLen.bind(this, post._id),
                    likes: likes.bind(this, post.likes),
                    userLiked: post.likes.includes(authID)
                }
            }) 
        } catch (error) {
            throw new Error(error)
        }
    },
    
    //get a specified user posts by _id
    userPosts: async (args, req) =>{
        
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            const authID = req.userID          
            const postImages = await PostImage.find({owner: req.userID})
            const postText =  await PostText.find({owner: req.userID})

            const newData = postImages.concat(postText)
            // sort it by new to onld by the post Date
            const sorted = await newData.sort((a, b) => b.date - a.date);
            return sorted.map(post => {
                let image = post.imageAlbum
                
                return{
                    _id: post._id,
                    ...post._doc,  
                    date: new Date(post._doc.date).toDateString(),
                    imageAlbum: [image  ? getImageFromS3(image[0], 'gsa-image-store') : null],
                    commnets: commentLen.bind(this, post._id),
                    owner:    user.bind(this, post.owner),
                    likes: likes.bind(this, post.likes),
                    userLiked: post.likes.includes(authID)
                }
            })

        } catch (error) {
            throw new Error(error.message)
        }
    },

    getUser: async (args, req) =>{
        if(!req.isAuth){
            throw new Error('Unauthanticated')
        }
        const id = args.user //args.user
       
        const info = await user(id)

        const userPost = await Posts(id)
    
        return{
            info: info,
            posts: userPost
        }
    },

    lookUp: async (args, req) =>{
        if(!req.isAuth){
            throw new Error('Unauthanticated')
        }
        let searhName = args.name
        const authID = await  req.userID
        const getSchool = await User.findOne({_id: authID} , {school: 1})
        if(searhName === 'all'){
            users = await User.find({school: getSchool.school}, {_id: authID}, {password: 0})

        }else{
            users = await getUser(searhName)

        }

      
        return users.map(user =>{
            return{
                _id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                avatar: user.avatar ? getImageFromS3(user.avatar, 'gsa-profile-image') : '' ,
                school: user.school,
                password: null
            }
        })
    },

    getComments: async (args, req)=>{
        if(!req.isAuth){
            throw new Error('Unauthanticated')
        }
        const postID = args.post

        const commentsData = await comments(postID);
        
        //console.log(commentsData);
        return commentsData
        
    },

    // search a user by fisrtname or lastname
    searchUser:  async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            } 
            const searhName = args.name
            const authID = await  req.userID
            // const searchString = new RegExp(userName, 'ig');
            const users = await getUser(searhName)
           
            return users.map(user =>{
                return{
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    avatar: user.avatar ? getImageFromS3(user.avatar, 'gsa-profile-image') : '' ,
                    school: user.school,
                    password: null
                }
            })
        } catch (error) {
            throw error 
        }
    },

    // return a single Authanticated user information
    userInfo : async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            
            const user =  await User.findOne({_id: req.userID}, {password: 0})
            return{
                _id: user._id,
                email: user._doc.email,
                firstname: user._doc.firstname,
                lastname: user._doc.lastname,
                school: user._doc.school,
                skills: user._doc.skills ? user._doc.skills : '' ,
                avatar: user.avatar ? getImageFromS3(user.avatar, 'gsa-profile-image') : '' ,
                major: user._doc.major ? user._doc.major: ' ',
                role: user._doc.role ? user._doc.role: ' ',
                interest: user._doc.interest ? user._doc.interest: '',
                date: new Date(user._doc.date).toDateString(),
            }
        } catch (error) {
            throw error
        }


    },

    //Mutation//
    // create a new PostImage 
    // User must be authanitcated
    createPostImage: async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            const postImage = new PostImage({
                owner: args.input.owner,
                imageAlbum: args.input.imageAlbum,
                text: args.input.text
            })
            await postImage.save()
            return{
               screen: true
            }
        } catch (error) {
            throw error
        }
    },

    // Create a new PostText
    // User msut be authanitcated
    createPostText: async (args, req) =>{
        try {
            if(!req.isAuth){
               
                throw new Error('Unauthanticated')
            }
            const postText = new PostText({
                owner: args.input.owner,
                text: args.input.text
            })

            await postText.save()
            

            return{
                screen: true
             }
        } catch (error) {
            throw error
        }
    },

    // create a new User
    signup: async (args) =>{
        try {
            const accountExist = await User.findOne({email: args.input.email}, {password: 0})
            if(accountExist){
                throw new Error("Email already existed")
            }
            // const validate = (email) => {
            //     const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
            //     return expression.test(String(email).toLowerCase())
            // }
            const hashPassword = await bcrypt.hash(args.input.password, 12);
            
            const user = new User({
                email: args.input.email,
                password: hashPassword,
                firstname: args.input.firstname,
                lastname: args.input.lastname,
                school: args.input.school,
                major: args.input.major,
                role: args.input.role,
                skills: args.input.skills,
                interest: args.input.interest
            })
             
            if(validate(user.email)){
                const result = await user.save()
            
                const send = await sendMailFun(result._id)

                return{
                    success: send ? true : false,
                    _id: result._id
                }
            }else{
                throw new Error("Email not valid")
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    },

    //login func 
    login: async (args, req) =>{
        try {
            const accountExist = await User.findOne({email: args.input.email})
            //check if user exit
            if(!accountExist){
                throw new Error("Email does not exist")
            }
           
            if(!accountExist.confirmed){ 
                await sendMailFun(accountExist._id)
                return{
                    success: false,
                    _id: accountExist._id,
                    token: '',
                    email: ''
                }
            }     
            const compare = await bcrypt.compareSync(args.input.password, accountExist.password)

            if(!compare){
                throw new Error('Password does not match')
            }else{
             
                const payload = {
                    id: accountExist._id,
                    email: accountExist.email,
                    firstname: accountExist.firstname,
                    lastname: accountExist.lastname,
                    date: accountExist.date
                }
                
                //token expire in one year
               const token = jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {expiresIn: '365d'},
                )
           
                return{
                    token: 'Bearer ' + token,
                    success: true,
                    _id: accountExist._id,
                    email: accountExist.email,
                }
            }
        } catch (error) {
            throw error
        }
    },

    //create a New Comment for a Post
    //user Must be Authanicated
    createCommnet: async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            
            const postTextExist = await  PostImage.findOne({_id:  args.input.post})
            const postImageExist = await PostText.findOne({_id:  args.input.post})
            const userExist =  await User.findOne({_id: req.userID}, {password: 0})

            let post  = postImageExist ? postImageExist : postTextExist
            if(!post || !userExist){
                throw new Error("User or Post not found")
            }

            const comment = new Comments({
              post: args.input.post,
              text: args.input.text,
              byUser: req.userID
            })

            const result = await comment.save()
            post.commnets.push(comment);
            await post.save()
            // const postID  = await result.post
            // // console.log(postID);
            // const commentsData = await comments(postID);
            // console.log(commentsData.length);
            // return commentsData
            // // console.log(commentsData);
            // //console.log(result);
            return{
                ...result._doc
            }
        } catch (error) {
            throw new Error(error.message)
        }
    },
    // post like func
    //  Add a  like or Remove a like from Post
    like: async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            const user =  req.userID 
            const postTextExist = await  PostImage.findOne({_id: args.input.post})
            const postImageExist = await PostText.findOne({_id:  args.input.post})
            const userExist =  await User.findOne({_id: user}, {password: 0})
    
            let post  = postImageExist ? postImageExist : postTextExist
            if(!post || !userExist){
                throw new Error("User or Post not found")
            }
            
            //update like for post if the user already like it and click on the like again it get removed
            const getUser = post.likes.indexOf(user)
            if(getUser > -1){
                post.likes.splice(getUser, 1)
                await post.save()
            }else{
                post.likes.push(user);
                await post.save()
            }
            return{
                _id: user,
                success: true
            }
        } catch (error) {
            throw new Error(error.message)
        }

    },

    // delete post 
    //user Must be Authanicated
    deletePost: async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            const user =  req.userID 
            const  postImageExist = await  PostImage.findOne({_id: args.input.post})
            const postTextExist = await PostText.findOne({_id:  args.input.post})
            //const userExist =  await User.findOne({_id: user}, {password: 0})
    
            let post  = postImageExist ? postImageExist : postTextExist
            if(!post){
                throw new Error("Post not found")
            }
            var postType;
            postImageExist ? postType = 'image' : postType = 'text'
           

            if(postType === 'image'){
    
                const s3 = new AWS.S3({
                    accessKeyId: keys.accessKey,
                    secretAccessKey: keys.secretKey,
                    Bucket: keys.bucketPost,
                    region: keys.region
                });

                const key  =  post.imageAlbum[0]
               
                //console.assert()
                const params = {
                    Bucket: keys.bucketPost,
                    Key: key
                }
                s3.deleteObject(params, (error, data) =>{
                    if(error) {
                        console.log(error);
                        throw new Error(error)
                    }
                    
                })
            }
            //console.assert()
            await Comments.deleteMany({post: post.id})
            await post.deleteOne()
           
            return{
                post: user,
                type: postType
            }
        } catch (error) {
            console.log(error);
            throw new Error(error.message)
            
        }

    },

    getImage: async (args, req) =>{

        if(!req.isAuth){
            throw new Error('Unauthanticated')
        } 
        const s3 = new AWS.S3({
            accessKeyId: keys.accessKey,
            secretAccessKey: keys.secretKey,
            Bucket: args.input.from,
            region: keys.region
        });


        const params =  {
            Bucket: args.input.from,
            Key: args.input.key
        }

        const para = {
            Bucket: args.input.from,
            Key: args.input.key,
            Expires: 100
        }

        const signurl = await s3.getSignedUrl("getObject",{
            Bucket: args.input.from,
            Key: args.input.key,
            Expires: 3600*120
        })
        
        // const image =  await s3.getObject(params).promise()
        ////Buffer.from(image.Body).toString('base64')
 
        return{
            image: signurl 
        }
    },

    // Update User Password
    updatePassword: async (args, req) =>{
        try {
            // if(!req.isAuth){
            //     throw new Error('Unauthanticated')
            // } 
            
            const accountExist = await User.findOne({email: args.input.email})
   
            if(!accountExist){
                throw new Error("Email does not exist")
            }  

            //check if password match

            if(args.input.currentPassword){
                const oldPassword = await bcrypt.compareSync(args.input.currentPassword, accountExist.password)
                if(!oldPassword)  throw new Error('Password does not match')
                
            }
            
            const hashPassword = await bcrypt.hash(args.input.newPassword, 12);
            accountExist.password =  hashPassword
            await accountExist.save()
            const payload = {
                id: accountExist._id,
                email: accountExist.email,
                firstname: accountExist.firstname,
                lastname: accountExist.lastname,
                date: accountExist.date
            } 
            const token = jwt.sign(
                payload,
                keys.secretOrKey,
                {expiresIn: '365d'},
            )
            return{
                token: 'Bearer ' + token,
                success: true,
                _id: accountExist._id,
                email: accountExist.email,
            }
            
        } catch (error) {
            throw error
            
        }

    },


    //update user information in the User document (Table)
    //user Must be Authanicated
    updateUserInfo: async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            const user =  req.userID 
            const userExist =  await User.findOne({_id: user}, {password: 0})
        
            if(!userExist){
                throw new Error("User or Post not found")
            }
            await userExist.updateOne({major: args.input.major, role: args.input.role, interest: args.input.interest, skills: args.input.skills})
            await userExist.save();
           
            return{
                success: true
            }
        } catch (error) {
            //console.log(error);
            throw error
        }
    },
    sendCode : async (args, req) =>{
        try {
            let userID = args.input.user
            if(validate(args.input.user)){
                const accountExist = await User.findOne({email: args.input.user}, {password: 0})
                userID = accountExist._id
            }

            send = await sendMailFun(userID)
            
            return{
                success: send ? true : false,
                _id: userID
            }
        } catch (error) {
            throw error
        }

    },
    verifyUser : async (args, req) =>{
        try {
            // const allCodes =  Verify.findOne()
           
            const verify = await Verify.findOne({user: args.input.user})

            if(!verify){
                throw new Error("Account can't be verified")
            }

            const accountExist = await User.findOne({_id: verify.user}, {password: 0})
            const code  = args.input.code
            if(code !==  verify.code){
                throw new Error('Code Does not Match')
            }

            accountExist.confirmed =  true
            await accountExist.save()
            await verify.remove()
            //create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                user: `${keys.email}`, // generated ethereal user
                pass: `${keys.code}`, // generated ethereal password
                },
            });

            const reqType = args.input.verifyType
            if(reqType === 'reset'){
                resData = ` 
                            <div>
                                <p>Your password have been reseted</p>
                                <p>if this was not you please notify the Admin</p>
                                <p>Happy Chatting 💬💬💬💬💬💬 </p>
                            </div>
                        `
            }else{
                resData = ` 
                    <div>
                        <p>Welcome to the GSA Portal App 📱📱📱📱📱📱📱</p>
                        <p>Happy Chatting 💬💬💬💬💬💬 </p>
                    </div>
                `
            }
            
            //send mail with defined transport object
            await transporter.sendMail({
                from: `"GSA PORTAL 🇬🇳 " <${keys.email}>`, // sender address
                to: `${accountExist.email}`, // list of receivers
                subject: "GSA PORTAL 🇬🇳", // Subject line
                text: "Hello New User 🤗", // plain text body
                html: `<b>Hello ${accountExist.firstname}</b>
                        <div> 
                            <hr>`+
                            resData
                            +`<hr>
                        </div>`, // html body
            }); 

           

            if(reqType === 'reset'){
                return{
                    token: '',
                    success: true,
                    _id: accountExist._id,
                    email: accountExist.email,
                }
            }else{
                const payload = await {
                    email: accountExist.email,
                    id: accountExist._id,
                    firstname: accountExist.firstname,
                    lastname: accountExist.lastname,
                    date: accountExist.date
                }
                const token = await jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {expiresIn: '365d'},
                )
                return{
                    token: 'Bearer ' + token,
                    success: true,
                    _id: accountExist._id,
                    email: accountExist.email,
                }
            }
        } catch (error) {
            throw error
        }

    }
}

module.exports  =  resolvers;