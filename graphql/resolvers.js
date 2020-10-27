const User = require('../model/User');
const PostText = require('../model/postText');
const Comments = require('../model/comment');
const Account = require('../model/account.js')

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
                byUser: user.bind(this, comment.byUser)
            }
        })

    } catch (error) {
        throw error
    }
}

const user = async email =>{
    try {
        const user = await User.findOne({email: email})
            return{
            ...user._doc,
            _id: user.id
        }
    } catch (error) {
        throw error
    }
}


module.exports = {
    //quary//
    singleUser: async () =>{
        try {
            const users = await
            User.find({_id: "5f81dcd86a4edbdd31c917d3"})
            return users.map(user =>{
                // console.log(...user._doc.post);
               return{
                    ...user._doc,
                    _id: user.id,
                    post: posts.bind(this, user.id),
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

    createUser: async (args) =>{
        try {
            const existingUser =  await User.findOne({email: args.userInput.email})
            if(existingUser){
                throw new Error("User already existed")
            }
            const user = new User({
                firstname: args.userInput.firstname,
                lastname: args.userInput.lastname,
                interest: args.userInput.interest
            });
            const result =  await user.save();
            return{
                ...result._doc
            }
        } catch (error) {
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
    }
}