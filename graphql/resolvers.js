const User = require('../model/User');
const PostText = require('../model/postText');
const Comments = require('../model/comment');


const getAllPost = async postID =>{
    
    try {
        const getAllPost = await PostText.find({_id: postID})
        console.log(getAllPost);
        return{
            ...getAllPost._doc,
            _id: getAllPost.id,
            

        }
    } catch (error) {
        throw "errorrrr"
    }
}


module.exports = {
    //quary//
    singleUser: async () =>{
        try {
            const singleUser = await
            User.find({_id: "5f81dcd86a4edbdd31c917d3"})
            .then()
            return singleUser.map(user =>{
                
               return{
                    ...user._doc,
                    _id: user.id,
                    post: getAllPost.bind(this, ...user._doc.post) 
                    //...user.post._doc,
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
            // const existingUser =  await User.findOne({username: args.userInput.username})
            // if(existingUser){
            //     throw new Error("User already existed")
            // }
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
    }
}