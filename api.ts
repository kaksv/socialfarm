import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

const API_URL = 'https://api.lens.dev'

// Creating the API Client.
export const client = new ApolloClient({
    uri: API_URL,
    cache: new InMemoryCache()
}) 

// Define a graphql query
export const exploreProfiles = gql`

query ExploreProfiles {
    exploreProfiles(request: { sortCriteria: MOST_FOLLOWERS }) {
        items {
            id
            name
            bio
            handle
            picture {
                ... on MediaSet {
                    original {
                        url
                    }
                }
            }
            stats {
                totalFollowers
            }
        }
    }
}
`
export const getProfile = gql`
query Profile($handle: Handle!) {
    profile(request: { handle: $handle}) {
        id
        name
        bio
        picture {
            ... on MediaSet {
                original {
                    url
                }
            }
        }
        handle
    }
}
`

export const getPublications = gql`
query Publications($id: Profiled!, $limit: LimitScalar) {
    publications(request: {
        profileId: $id,
        publicationTypes: [POST],
        limit: $limit
    }) {
        items {
            __typename
            ... on Post {
                ...PostFields
            }
        }
    }
}
fragment PostFields on Post {
    id
    metadata {
        ...MetadataOutputFields
    }
}
fragment MetadataOutputFields on MetadataOutput {
    content
}
`