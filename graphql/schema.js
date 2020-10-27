const {buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User{
        _id: ID!
        account: ID!
        firstname: String!
        lastname: String!
        school: String!
        major: String!
        role: String
        interest: [String!]
    }

    type Account{
        _id: ID!
        email: String!
        password: String!
    }

    type PostText{
        _id: ID!
        text: String!
        likes: [User!]!
        date: String!
    }

    type Comment{
        _id: ID!
        post: Account!
        text: String!
        byUser: User!
        likes: [Account!]!
        date: String
    }

    type PostImage {
        _id: ID!
        imageAlbum: [String!]!
        commnets: [Account!]!
        likes: [Account!]!
        date: String!
    }

    input AccountInput{
        email: String!
        password: String!
    }

    input UserInput{
        _id: ID!
        account: ID!
        firstname: String!
        lastname: String!
        school: String!
        major: String!
        role: String
        interest: [String!]
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
        singleUser: [Account!]!
    }

    type RootMutation{
        createPostText(postTextInput: PostTextInput): PostText
        createCommnet(commentInput: CommentInput): Comment
        createPostImage(postImage: PostImageInput!): PostImage
        createAccount(userInput: AccountInput): Account
        createUser(userInput: UserInput): User
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }


`)