const User = require('../model/User');
const PostText = require('../model/postText');
const Comments = require('../model/comment');
const Account = require('../model/Account');
const keys = require('../config/keys')
const bcrypt =  require('bcryptjs')
const passport  = require('passport')
const jwt =  require('jsonwebtoken');
const { Token } = require('graphql');
const { Error } = require('mongoose');
const { typeOf } = require('react-is');
const { Console } = require('console');

const posts = async owner =>{
    try {
        const posts = await PostText.find({owner: owner})
        return posts.map(post =>{
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


const comments =  async owner =>{
    // console.log(commentID);
    try {
        const comments = await Comments.find({post: owner})
        return comments.map(comment =>{
            console.log(comment);
            return{
                ...comment._doc,
                _id: comment.id,
                date: new Date(comment._doc.date).toDateString(),
                byUser: byUser.bind(this, comment.byUser)
            }
        })

    } catch (error) {
        throw error
    }
}

const byUser = async userId =>{
    try {
        const user = await Account.findOne({_id: userId})
            return{
            ...user._doc,
            _id: user.id,
            password: null
        }
    } catch (error) {
        throw error
    }
}


const user = async userId =>{

    try {
        const user =  await User.findOne({_id: userId})
        return{
            ...user._doc,
            _id: user.id,
        }
    } catch (error) {
        
    }
}

module.exports = {
    //quary//
    // userPostText: async (userID) =>{
    //     try {
    //         const getPosts = PostText.
    //     } catch (error) {
            
    //     }
    // },
    userInfo : async (args, req) =>{
        try {
            if(!req.isAuth){
                throw new Error('Unauthanticated')
            }
            // let tok = req.get("authorization")
            // let de =  jwt.verify(tok, 'secret')
            // console.log(de);
  
            const users =  await User.find({account: req.userID})
            console.log(users);
            return users.map(user =>{
                return{
                    ...user._doc,
                    _id: user.id
                }
            })
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
    createPostText: async (args) =>{
        try {
            const userExist = await User.findOne({_id: args.postTextInput.owner})
            if(!userExist){
                throw new Error("User dones not exist")
            }
            const postText = new PostText({
                owner: args.postTextInput.owner,
                text: args.postTextInput.text
            })
            const result =await  postText.save()
            userExist.post.push(postText)
           await userExist.save()
            return{
                ...result._doc
            }
        } catch (error) {
            throw error
        }
    },

    signup: async (args) =>{
        try {
            const accountExist = await Account.findOne({email: args.input.email})

            if(accountExist){
                throw new Error("Email already beign used")
            }
    
            const hashPassword = await bcrypt.hash(args.input.password, 12);
            const account = new Account({
                email: args.input.email,
                password: hashPassword
            })
            const result = await account.save()
            const userExist =  await User.findOne({account: accountExist? accountExist._id : result._id})
            
            console.log();
            const payload = {
                email: result.email,
                id: result._id,
                date: result.date
            }
            const token = jwt.sign(
                payload,
                keys.secretOrKey,
                {expiresIn: '365'},
            )
            return{
                token: 'Bearer ' + token,
                success: true,
                info: userExist ? true : false,
                account: {
                _id: result._id,
                email: result.email,
                password: 'null'
                }
            }
        } catch (error) {
            throw error
        }
    },

    login: async (args) =>{
        try {
            const accountExist = await Account.findOne({email: args.input.email})

            if(!accountExist){
                throw new Error("Email does not exist")
            }
     
            const userExist =  await User.findOne({account: accountExist ? accountExist._id: '00000000000000'})
            
           
            const account = new Account({
                email: args.input.email,
                password: args.input.password
            })
            const compare = await bcrypt.compareSync(account.password, accountExist.password)
            
            // if(!userExist){
            // }
            if(!compare){
                throw new Error('Password does not match')
            }else{
                const payload = {
                    email: accountExist.email,
                    id: accountExist._id,
                    date: accountExist.date
                }
               const token = jwt.sign(
                    payload,
                    keys.secretOrKey,
                    {expiresIn: '365d'},
                )
           
                return{
                    token: 'Bearer ' +token,
                    success: true,
                    info: userExist ? true : false,
                    account: {
                    _id: accountExist._id,
                    email: accountExist.email,
                    password: 'null'
                    }
                }
            }
        } catch (error) {
            throw error
        }
    },
    createUser: async (args, req) =>{
        try {
            if(req.isAuth){
                throw new Error('Unauthanticated')
            }

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
            console.log({error});
            throw error
        }
    },

    createCommnet: async (args) =>{
        try {
            const postExist = await PostText.findOne({_id: args.commentInput.post})
            const userExist =  await User.findOne({_id: args.commentInput.byUser})

            if(!postExist || !userExist){
                throw new Error("User or Post not found")
            }

            const comment = new Comments({
              post: args.commentInput.post,
              text: args.commentInput.text,
              byUser: args.commentInput.byUser
            })

            const result = await comment.save()
            postExist.commnets.push(comment);
            await postExist.save()
            console.log(comment)
            return{
                ...result._doc
            }
        } catch (error) {
            throw error
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

  
            return{
                data: 'hello'
            }
            
        } catch (error) {
            
        }


    }
}