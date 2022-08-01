const express = require('express')

// const expressGraphQL = require('express-graphql')

const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLInt } = require('graphql');
const app = express()
const books = [
    {id: 1, name: 'THe first book', authorId: 2},
    {id: 2, name: 'THe super book', authorId: 1},
    {id: 3, name: 'THe amazing book', authorId: 2},
    {id: 4, name: 'THe eighth book', authorId: 1},
]
const authors = [
    {id: 1, name: 'Kachatryan'},
    {id: 2, name: 'EudaldBuch'},
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book type',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        authorId: {
            type: GraphQLNonNull(GraphQLInt)
        },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author',
    fields: () => ({
        id: {
            type: GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLNonNull(GraphQLString)
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        books: {
            type: GraphQLList(BookType),
            description: 'List of all books',
            resolve: () => books
        },
        book: {
            type: BookType,
            description: 'A single Book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => {
                return books.find(book => book.id === args.id)
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            description: 'List of all authors',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'A single author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => {
                return authors.find(author => author.id === args.id)
            }
        }
    })
})
const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Adds a book',
            args: {
                name: {type: GraphQLNonNull(GraphQLString)},
                authorId: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const book = {
                    id: books[books.length - 1].id + 1,
                    name: args.name,
                    authorId: args.authorId,
                    author: authors.find(author => args.authorId === author.id)
                }
                books.push(book)
                return book
            }

        },
        deleteBook: {
            type: GraphQLList(BookType),
            description: 'Deletes a Book by id',
            args: {
                id: {type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                books.splice(args.id, 1)
                return books
            }
        }
    })
})
const schema = new GraphQLSchema({
    query:  RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema: schema,
}))

app.listen(5000., () => console.log('OKIII'))