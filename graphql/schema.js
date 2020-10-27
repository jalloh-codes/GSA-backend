const {buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User{
        _id: ID!
        firstname: String!
        lastname: String!
        post: PostText!
        interest: [String!]!
    }
    type PostText{
        _id: ID!
        text: String!
        likes: [User!]!
        date: String!
    }
    type Comment{
        _id: ID!
        post: PostText!
        text: String!
        byUser: User!
        likes: [User!]!
        date: String
    }
    type PostImage {
        _id: ID!
        imageAlbum: [String!]!
        commnets: [User!]!
        likes: [User!]!
        date: String!
    }

    input UserInput{
        firstname: String!
        lastname: String!
        interest: [String!]!
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
    }
    schema{
        query: RootQuery
        mutation: RootMutation
    }


`)