export function prepareRegex(s: string): string {
    const list = s.split('\n');
    if (s.indexOf('\\#') !== -1) {
        console.log(s);
        // есть комментарии, убираем их
        const result = list
            .map((e) => e.trim())
            .map((row) => {
                const startCommentIndex = row.search(/(?<!\\)#/);
                console.log(startCommentIndex);
                return (startCommentIndex === -1
                    ? row
                    : row.slice(0, startCommentIndex)
                ).trim();
            })
            .join('');
        console.log(result);
        return result;
    } else {
        return list.join('');
    }
}
