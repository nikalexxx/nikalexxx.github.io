export interface Comment {
    created_at: string;
    updated_at: string;
    body: string;
    user: {
        login: string;
        avatar_url: string;
    }
}

export function getIssueComments(login: string, repo: string, issue: string): Promise<Comment[]> {
    return fetch(
        `https://api.github.com/repos/${login}/${repo}/issues/${issue}/comments`
    ).then((response) => response.json());
}
