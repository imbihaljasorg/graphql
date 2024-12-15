async function makeGraphQLRequest(query, JWToken) {
    const response = await fetch('https://01.kood.tech/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${JWToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    });

    if (!response.ok) {
        console.error("Error in response:", response.statusText);
        return null;
    }

    return await response.json();
}

export async function fetchUserData(JWToken) {
    const query = `{
        user {
            id
            login
            attrs
            createdAt
        }
    }`;

    try {
        const data = await makeGraphQLRequest(query, JWToken);
            return data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.clear();
        return null;
    }
}

export async function fetchTransactions(JWToken) {
    const query = `{
        transaction {
            amount
            type
            path
        }
    }`;

    try {
        const data = await makeGraphQLRequest(query, JWToken);
        console.log("Fetched transactions:", data);
        return data?.data?.transaction || [];
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return [];
    }
}

export async function fetchGameResults(JWToken) {
    const query = `{
        user {
            sessions {
                started_at
                games {
                    started_at
                    name
                    duration
                    points
                    results {
                        level
                        attempts
                    }
                }
            }
        }
    }`;

    try {
        const response = await makeGraphQLRequest(query, JWToken);
        if (response.errors) {
            return [];
        }

        const sessions = response?.data?.user[0]?.sessions || [];
        return sessions;
    } catch (error) {
        console.error("Error fetching game results:", error);
        return [];
    }
}