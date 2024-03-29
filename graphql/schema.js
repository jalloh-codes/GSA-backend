const {buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        avatar: String
        firstname: String!
        lastname: String!
        school: String!
        major: String!
        role: String
        skills: [String]
        interest: [String]
    }

    type Verify {
        _id: ID!
        user: User!
        code: String!
    }

    type PostText {
        _id: ID!
        owner: User
        text: String!
        likes: [ID!]!
        date: String!
    }

    type Comment {
        _id: ID!
        post: ID!
        text: String!
        byUser: User
        likes: [User]
        date: String
    }

    type UserPostInfo{
        _id: ID!
        email: String!
        avatar: String
        firstname: String!
        lastname: String!
        school: String!
    }

    type PostImage {
        _id: ID!
        owner: User
        imageAlbum: [String]
        text: String
        commnets: String
        likes: [User]
        date: String
        userLiked: Boolean
    }

    input AccountInput {
        email: String!
        password: String!
    }

    input UserInput {
        email: String!
        password: String!
        firstname: String!
        lastname: String!
        school: String!
        major: String
        role: String
        skills: [String]
        interest: [String]
    }
    type AuthPayload {
        token: String!
        success: Boolean
        _id: ID!
        email: String!
    }
    input PostTextInput {
        owner: ID!
        text: String!
    }
    input PostImageInput {
        owner: ID!
        imageAlbum: [String]
        text: String
    }
    
    input CommentInput {
        post: ID!
        text: String!
    }
    input ProfileImage {
        image: String!
    }
    input createLike {
        post: ID!
    }
    input createDeletePost{
        post: ID!
    }
    input chnagePassword{
        email: String!
        currentPassword: String!
        newPassword: String!
    }
    input chnageInfo{
        major: String!
        role: String
        skills: [String]
        interest: [String]
    }

    input verify{
        user: ID!
        code: String!
        verifyType: String!
    }

    input resend {
        user: String!
    }

    input resendCode{
        email: String!
    }

   
    input imageReq{
        key: String!
    }
    input userReq{
        user: ID
    }

    type Result {
        success: Boolean
        _id: ID
        type: String
        image: String
    }
    type userResult{
        info: User
        posts: [PostImage]
    }

    type test{
        status: Boolean
    }

    type RootQuery {
        postText: [PostText]
        commnets: [Comment]
        postImage: [PostImage]
        userInfo: User
        userPosts: [PostImage]
        allPost: [PostImage]
        searchUser(name: String):[User]
        lookUp(name: String): [User]
        connection: Result
        conn(input: AccountInput): Result
        getUser(user: String!): userResult
        getComments(post: ID!): [Comment]
    }
    
    type RootMutation { 
        createPostText(input: PostTextInput):Result
        createCommnet(input: CommentInput): Comment
        createPostImage(input: PostImageInput): Result
        signup(input: UserInput): Result
        login(input: AccountInput): AuthPayload
        profileImage(input: ProfileImage):  Result
        like(input: createLike): Result
        deletePost(input: createDeletePost): Result
        updatePassword(input: chnagePassword): AuthPayload
        updateUserInfo(input: chnageInfo): Result
        verifyUser(input: verify): AuthPayload
        sendCode(input: resend): Result 
        con(input: AccountInput): Result
        getImage(input: imageReq): Result
        
    }

    type Subscription {
        createPostText: PostText!
        removePostText: PostText!
        createPostImage: PostImage!
        removePostImafe: PostImage!
        createComment: Comment!
        postTextLiked: PostText!
        postTextDisLiked: PostText!
        postImageLiked:  PostImage!
        postImageDisLiked: PostImage!

    }

    schema{
        query: RootQuery
        mutation: RootMutation
        subscription: Subscription
    }
`)