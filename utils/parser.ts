const SafetyLink = /\bhttps:\/\/([a-z-]+\.)?[a-z-]+\.[a-z-]+(\/[0-9a-z-\.\?]*)*\b/g;

type Item = { type: 'text' | 'link'; body: string };
export function textWithLink(text: string): any {
    const result: Item[] = [];
    let currentIndex = 0;
    for (const elem of text.matchAll(SafetyLink)) {
        const link: string = elem[0];
        const { index } = elem;

        result.push(
            {
                type: 'text',
                body: text.substring(currentIndex, index),
            },
            {
                type: 'link',
                body: link,
            }
        );

        currentIndex = index + link.length;
    }
    if (currentIndex < text.length) {
        result.push({
            type: 'text',
            body: text.substring(currentIndex),
        });
    }

    return result;
}
