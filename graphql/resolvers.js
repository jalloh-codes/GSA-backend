const User = require('../model/User');
const PostText = require('../model/postText');
const Comments = require('../model/comment');
const Account = require('../model/Account');
const PostImage = require('../model/postImage');
const keys = require('../config/keys')
const bcrypt =  require('bcryptjs')
const passport  = require('passport')
const jwt =  require('jsonwebtoken');
const { Token } = require('graphql');
const { Error } = require('mongoose');
const { typeOf } = require('react-is');
const { Console } = require('console');
//const postImage = require('../model/postImage');


// return all post owned by  user in the Account document
const posts = async owner =>{
    try {
        const postsText = await PostText.find({owner: owner})
        const postImage  =  await PostImage.find({owner: owner})
        const newData = postImage.concat(postsText)
        return newData.map(post =>{
            return{
                ...post._doc,
                _id: post.id,
                date: new Date(post._doc.date).toDateString(),
                commnets: comments.bind(this, post.id),
            }
        })
    } catch (error) {
        throw error
    }
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
                byUser: user.bind(this, comment.byUser)
            }
        })
    } catch (error) {
        throw error
    }
}

const byUser = async userId =>{
    try {
        const user = await User.findOne({_id: userId})
            return{
            _id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar,
            school: user.school,
            password: null
        }
    } catch (error) {
        throw error
    }
}

//return a single user by providing the User document _id
const user = async userId =>{

    try {
        const user =  await User.findOne({_id: userId})
        return{
            _id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            avatar: user.avatar,
            school: user.school,
            password: null
        }
    } catch (error) {
        
    }
}

module.exports = {

    //get all authanticated user posts
    profileImage: async (args, req) =>{
        if(!req.isAuth){
            throw new Error('Unauthanticated')
        }
        const image =  args.input.image
        const  user  = await User.updateOne({_id: req.userID}, {$set:{ "avatar": image}})
        //user.updateOne({$set:{ "avatar": image}})
        //await user.save()
        return{
            success: true
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
                    owner: user.bind(this, post.owner),
                    date: new Date(post._doc.date).toDateString(),
                    commnets: comments.bind(this, post.id)
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
            const sorted = await newData.sort((a, b) => b.date - a.date);
            return sorted.map(post => {
                return{
                    ...post._doc, 
                    _id: post.id,
                    date: new Date(post._doc.date).toDateString(),
                    // imageAlbum:  [{...post.imageAlbum}]
                    commnets: comments.bind(this, post.id)
                }
            })

        } catch (error) {
            throw new Error(error.message)
        }
    },
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
    singleUser: async (email) =>{
        try {
            const accounts = await
            Account.findOne({email: email})
            return accounts.map(account =>{
                // console.log(...user._doc.post);
               return{
                    ...account._doc,
                    _id: account.id,
                    user: user.bind(this, account.user_doc),
                    // ...user.post._doc,
                }
            }) 
        } catch (error) {
            throw error
        }
    },

    //Mutation//
    createPostImage: async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            const postImage = new PostImage({
                owner: args.postImage.owner,
                imageAlbum: args.postImage.imageAlbum,
                text: args.postImage.text
            })
            const result =  await postImage.save()
            return{
                ...result._doc
            }
        } catch (error) {
            console.log(error);
        }
    },
    createPostText: async (args) =>{
        try {
            const postText = new PostText({
                owner: args.postTextInput.owner,
                text: args.postTextInput.text
            })

            const result =await  postText.save()
            return{
                ...result._doc
            }
        } catch (error) {
            throw error
        }
    },

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

            const payload = {
                email: result.email,
                id: result._id,
                firstname: result.firstname,
                lastname: result.lastname,
                date: result.date
            }
            const token = jwt.sign(
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
            throw error
        }
    },

    login: async (args) =>{
        try {
            const accountExist = await User.findOne({email: args.input.email})
            if(!accountExist){
                throw new Error("Email does not exist")
            }       
           
            const account = new Account({
                email: args.input.email,
                password: args.input.password
            })
            const compare = await bcrypt.compareSync(account.password, accountExist.password)

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
    createUser: async (args, req) =>{
        try {
            // if(!req.isAuth){
            //     throw new Error('Unauthanticated')
            // }

            const existingAccount =  await Account.findOne({_id: args.userInput.account})
            const userExist =  await User.findOne({account: args.userInput.account})
            if(!existingAccount){
                throw new Error("User does not exist")
            }
            if(userExist){
                throw new Error("Account information already saved")
            }

            // if(existingAccount && !userExist){
     
            const user = new User({
                account:    args.userInput.account,
                firstname: args.userInput.firstname,
                lastname: args.userInput.lastname,
                school: args.userInput.school,
                major: args.userInput.major,
                role: args.userInput.role,
                skills: args.userInput.skills,
                interest: args.userInput.interest
            });
            const result =  await user.save();
            // console.log(user);
            //const userExist =  await User.findOne({account: accountExist ? accountExist._id: '00000000000000'})
            return{
                scuccess: true,
                ...result._doc
            }
            // }else{
            //     console.log('error');
            //     throw Error('Account already created')
            // }
        } catch (error) {
            throw error
        }
    },

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
    singleUpload: async (args) =>{
        try {
            console.log(args.postImage);
        } catch (error) {
            throw error
        }
    },
    connection: async (args, req) =>{
        try {
            // if(!req.isAuth){
            //     throw new Error('Unauthanticated')
            // }

            //console.log(req.userID);
            return{
                data: 'hello'
            }
            
        } catch (error) {
            
        }


    }
}