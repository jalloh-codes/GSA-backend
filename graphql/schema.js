const {buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Account {
        _id: ID!
        email: String!
        password: String!
        user: ID
    }

    type User {
        _id: ID!
        account: ID!
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
        text: String!
        likes: [ID!]!
        date: String!
    }
    type Comment {
        _id: ID!
        post: PostText!
        text: String!
        byUser: ID!
        likes: [ID!]!
        date: String
    }
    type PostImage {
        _id: ID!
        imageAlbum: [String!]!
        commnets: [Account!]!
        likes: [ID!]!
        date: String!
    }

    type Connection {
        data: String
    }

    input AccountInput {
        email: String!
        password: String!
    }


    input UserInput {
        account: ID!
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
        info: Boolean
        account: Account!
    }
    input PostTextInput {
        owner: ID!
        text: String!
    }

    input PostImageInput {
        imageAlbum: [String!]!
    }
    input CommentInput {
        post: ID!
        text: String!
        byUser: ID!
    }

    type RootQuery {
        postText: [PostText!]!
        commnet: [Comment!]!
        postImage: [PostImage!]!
        singleUser: [User!]!
        userInfo: [User!]!
        connection: Connection
    }

    
    type RootMutation { 
        createPostText(postTextInput: PostTextInput): PostText
        createCommnet(commentInput: CommentInput): Comment
        createPostImage(postImage: PostImageInput): PostImage
        createUser(userInput: UserInput): User
        signup(input: AccountInput): AuthPayload
        login(input: AccountInput): AuthPayload
        
    }
    
    schema{
        query: RootQuery
        mutation: RootMutation
    }


`)