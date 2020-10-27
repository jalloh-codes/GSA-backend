const {buildSchema } = require('graphql')

module.exports = buildSchema(`
    type Account{
        email: String!
        password: String!
    }
    type User{
        _id: ID!
        account: Account!
        firstname: String!
        lastname: String!
        school: String!
        major: String!
        role: String
        interest: [String]
    }

    type PostText{
        _id: ID!
        text: String!
        likes: [Account!]!
        date: String!
    }
    type Comment{
        _id: ID!
        post: PostText!
        text: String!
        byUser: Account!
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
        account: Account!
        firstname: String!
        lastname: String!
        school: String!
        major: String
        role: String
        interest: [String]
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
    }
    type RootMutation{
        createPostText(postTextInput: PostTextInput): PostText
        createCommnet(commentInput: CommentInput): Comment
        createPostImage(postImage: PostImageInput!): PostImage
        createUser(userInput: UserInput): User
        createAccount(accountInput: AccountInput): Account
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }


`)