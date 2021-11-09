const example = (E: any) =>
    E.div.class`example`.id`ex`.style('color: red;')['data-value']`1`(
        'string',
        E.span`text`,
        E.p('str'),
        E`text v = ${E.span(2)}`,
        [
            // Fragment analog
            E.div.style`color: red;`,
            E.div.style`color: red;`('red'),
            E.div.style`color: red;``red`,
            E.div.style`color: red;``red ${E.span(1)}`, // red [Function]
            E.div.style`color: red;`(E`red${E.span(1)}`), // red 1
        ],
        ...[1, 2, 3].map((i) => E.i._key(i)(i)),
        [1, 2, 3].map((i) => E.i._key(i)(i))
    );
