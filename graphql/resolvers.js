const User = require('../model/User');
const PostText = require('../model/postText');
const Comments = require('../model/comment');
const PostImage = require('../model/postImage');
const keys = require('../config/keys')
const bcrypt =  require('bcryptjs')
const jwt =  require('jsonwebtoken');
const { Error } = require('mongoose');
const { PubSub } =  require('graphql-subscriptions');
const pubsub = new PubSub();

// return all post owned by  a user in the User document (Table)
// Required user ID 
// PostImage && PostText is returned

const TEXT_POST_CREATED = 'TEXT_POST_CREATED';
const posts = async owner =>{
    // owner == user ID from the User Document (Table)
    try {
        const postsText = await PostText.find({owner: owner})
        const postImage  =  await PostImage.find({owner: owner})

        // concatinate PostImage && PostText array of object
        const newData = postImage.concat(postsText)
        return newData.map(post =>{
            return{
                ...post._doc,
                _id: post.id,
                date: new Date(post._doc.date).toDateString(),
                // comment is a function
                // return all comment from a Post by Profiding the Post ID
                commnets: comments.bind(this, post.id),
            }
        })
    } catch (error) {
        throw error
    }
}

const likes = async (idArr) =>{
    const users = []
    for(let i = 0; i < idArr.length; i++){
        const likes = await User.findOne({_id: idArr[i]})
        if(likes){
            users.push(likes)
        }
    }

    
    return users.map(user =>{
        return{
            _id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar ? user.avatar : '',
            school: user.school,
            password: null
        }
    })
}


// return all comments that is acosiated to a post.
// must provide the the post _id
const comments =  async owner =>{
    // console.log(commentID);
    try {
        const comments = await Comments.find({post: owner})
        return comments.map(comment =>{
            return{
                ...comment._doc,
                _id: comment.id,  
                date: new Date(comment._doc.date).toDateString(),
                //user is a function
                // Required User ID it return user information
                // Return firstName, Lastname, school, email, Avatar
                byUser: user.bind(this, comment.byUser)
            }
        })
    } catch (error) {
        throw error
    }
}


//return a single user by providing the User ID
//Password must b set to Null when returning data from the User Document 
const user = async userId =>{

    try {
        const user =  await User.findOne({_id: userId})
       
        user.password = null
        return{
            _id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar ? user.avatar : '',
            school: user.school,
            email: user.email,
            password: null
        }
    } catch (error) {
        console.log(error);
        throw error
    }
}

const resolvers = {
//61105aee355303b9a81ff12b
    //save User Image Profile (Avatar)
    profileImage: async (args, req) =>{

        //determine if a User is authanicated or not
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            // data type must be String not an object
            const image =  args.input.image
            const  user  = await User.updateOne({_id: req.userID}, {$set:{ "avatar": image}})
            return{
                success: true
            }
        } catch (error) {
            throw error
        }
    },

    allPost: async (args, req) =>{
        try {

            // if(!req.isAuth){
            //     throw new Error('Unauthanticated')
            // } 
    
            const imagePost =  await PostImage.find({$query: {},$orderby: {date: 1}});
            const textPost =  await PostText.find({$query: {},$orderby: {date: 1}});
            
            //concatenate  image and text posts
            const newData = imagePost.concat(textPost);
            //sort by by post date
            const sorted = await newData.sort((a, b) => b.date - a.date);

            return sorted.map(post =>{
                return{
                    _id: post.id,
                    ...post._doc,
                    date: new Date(post._doc.date).toDateString(),
                    owner: user.bind(this, post.owner),
                    commnets: comments.bind(this, post.id),
                    likes: likes.bind(this, post.likes)
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

            const postImages = await PostImage.find({owner: req.userID})
            const postText =  await PostText.find({owner: req.userID})

            const newData = postImages.concat(postText)
            // sort it by new to onld by the post Date
            const sorted = await newData.sort((a, b) => b.date - a.date);
            // pubsub.publish(TEXT_POST_CREATED, { sorted});
            return sorted.map(post => {
           
                return{
                    _id: post.id,
                    ...post._doc,  
                    date: new Date(post._doc.date).toDateString(),
                    // comment is a functioin
                    commnets: comments.bind(this, post.id),
                    owner:    user.bind(this, post.owner),
                    // likes is a function
                    likes: likes.bind(this, post.likes)
                }
            })

        } catch (error) {
            throw new Error(error.message)
        }
    },

    //TODO
    // search a user by fisrtname or lastname
    searchUser:  async (args, req) =>{
        try {
            await User.createIndex(
                {
                  firstname: "text",
                  lastname: "text"
                }
              )
            const query = {$text: {$search: ` cellou`}};
            const projection ={
                _id: 0,
                firstname: 1
            }
            const users = await User.find({$text:{ $search:"cellou"}})
            // console.log(users);
            return users.map(user =>{
                return{
                    _id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    avatar: user.avatar,
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
            
            const user =  await User.findOne({_id: req.userID})
            return{
                _id: user.id,
                email: user._doc.email,
                firstname: user._doc.firstname,
                lastname: user._doc.lastname,
                school: user._doc.school,
                password: null,
                skills: user._doc.skills ? user._doc.skills : '' ,
                avatar: user._doc.avatar ? user._doc.avatar : '',
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
            // console.log(args);
            const postImage = new PostImage({
                owner: args.input.owner,
                imageAlbum: args.input.imageAlbum,
                text: args.input.text
            })
            await postImage.save()
            // console.log({postImage});
            return{
               screen: true
            }
        } catch (error) {
            // console.log(error);
            throw error
        }
    },

    // Create a new PostText
    // User msut be authanitcated
    createPostText: async (args, req) =>{
        try {
            if(!req.isAuth){
                // console.log(req.isAuth);
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
            const accountExist = await User.findOne({email: args.input.email})

            if(accountExist){
                throw new Error("Email already existed")
            }
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
            const result = await user.save()

            const payload = await {
                email: result.email,
                id: result._id,
                firstname: result.firstname,
                lastname: result.lastname,
                date: result.date
            }

            const token = await jwt.sign(
                payload,
                keys.secretOrKey,
                {expiresIn: '365d'},
            )

            return{
                token: 'Bearer ' + token,
                success: true,
                _id: result._id,
                email: result.email,
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
            const userExist =  await User.findOne({_id: req.userID})

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
            const userExist =  await User.findOne({_id: user})
    
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
            const postTextExist = await  PostImage.findOne({_id: args.input.post})
            const postImageExist = await PostText.findOne({_id:  args.input.post})
            const userExist =  await User.findOne({_id: user})
    
            let post  = postImageExist ? postImageExist : postTextExist
            if(!post || !userExist){
                throw new Error("User or Post not found")
            }
            await Comments.deleteMany({post: post.id})
            await post.deleteOne()
            return{
                post: user
            }
        } catch (error) {
            throw new Error(error.message)
        }

    },

    // Update User Password
    updatePassword: async (args, req) =>{
        try {
            const accountExist = await User.findOne({email: args.input.email})
   
            if(!accountExist){
                throw new Error("Email does not exist")
            }  

            //check if password match
            const oldPassword = await bcrypt.compareSync(args.input.currentPassword, accountExist.password)
    
            if(!oldPassword){
                throw new Error('Password does not match')
            }else{
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
            }
        } catch (error) {
            //console.log(error);
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
            const userExist =  await User.findOne({_id: user})
        
            if(!userExist){
                throw new Error("User or Post not found")
            }
            await userExist.updateOne({major: args.input.major, role: args.input.role, interest: args.input.interest, skills: args.input.skills})
            await userExist.save();
            // console.log(await User.findOne({_id: user}));
            return{
                success: true
            }
        } catch (error) {
            //console.log(error);
            throw error
        }
    },
    connection : async (args, req) =>{
        try {
            // if(!req.isAuth){
            //     throw new Error('Unauthanticated')
            // }

          
            return{
                success: true
            }
            
        } catch (error) {
            
        }
    },

    // Subscription:{
    //     createPostText:{
    //         subscribe: () => pubsub.asyncIterator(TEXT_POST_CREATED)
    //     }
    // }
    
}

module.exports  =  resolvers;