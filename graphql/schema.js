const {buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User {
        _id: ID!
        email: String!
        avatar: String!
        firstname: String!
        lastname: String!
        school: String!
        major: String!
        role: String
        skills: [String]
        interest: [String]
    }
    type PostText {
        _id: ID!
        owner: ID!
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
    type PostImage {
        _id: ID!
        owner: User
        imageAlbum: [String!]
        text: String!
        commnets: [Comment]
        likes: [User]!
        date: String!
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
        imageAlbum: [String!]!
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
        major: String
        role: String
        skills: [String]
        interest: [String]
    }

    type Result {
        success: Boolean
    }
    type RootQuery {
        postText: [PostText!]!
        commnets: [Comment!]!
        postImage: [PostImage!]!
        userInfo: User
        userPosts: [PostImage]
        allPost: [PostImage]
        searchUser(searchText: String!):[User]
        connection: Result
        conn(input: AccountInput): Result
    }   
    type RootMutation { 
        createPostText(postTextInput: PostTextInput): PostText
        createCommnet(input: CommentInput): Comment
        createPostImage(postImage: PostImageInput): PostImage
        signup(input: UserInput): AuthPayload
        login(input: AccountInput): AuthPayload
        profileImage(input: ProfileImage):  Result
        like(input: createLike): Result
        deletePost(input: createDeletePost): Result
        updatePassword(input: chnagePassword): AuthPayload
        updateUserInfo(input: chnageInfo): Result
        con(input: AccountInput): Result
    }
    type Subscription {
        createPostText: PostImage
        createCommnet: PostImage
        createPostImage: PostImage
    }
    schema{
        query: RootQuery
        mutation: RootMutation
        subscription: Subscription
    }
`)