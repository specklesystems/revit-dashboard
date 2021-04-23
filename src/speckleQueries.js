export const userInfoQuery = () => `query {
      user {
        name
      },
      serverInfo {
        name
        company
      }
    }`

export const streamCommitsQuery = (streamId, itemsPerPage, cursor) => `query {
                stream(id: "${streamId}"){
                  commits(limit: ${itemsPerPage}, cursor: ${cursor ? '"' + cursor + '"' : null}) {
                    totalCount
                    cursor
                    items{
                      id
                      message
                      branchName
                      sourceApplication
                      referencedObject
                      authorName
                      createdAt
                    }
                  }
                }
              }`

export const streamSearchQuery = (search) => `query {
      streams(query: "${search}") {
        totalCount
        cursor
        items {
          id
          name
          updatedAt
        }
      }
    }`
