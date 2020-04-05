export function Class(createClass) {
    const fields = {};
    const field = new Proxy({}, {
        get(target, prop) {
            return getter => {
                fields[prop] = getter;
            }
        }
    });
    return initialValues => {
        const constructor = create => create(initialValues);
        createClass({field, constructor});
        return new Proxy({}, {
            get(target, prop) {
                return prop in fields ? fields[prop]() : undefined;
            }
        })
    }
}

// const Count = Class(({constructor, field}) => {
//     let a = 0; // private field
//     constructor(x => {
//         a = x;
//     });
//     field.a(() => a); // public field
//     const add = () => a++; // private method
//     field.add(() => add); // public method
// });

// const counter1 = Count(1);
// console.log(counter1.a); // 1
// counter1.add();
// counter1.add();
// console.log(counter1.a); // 3

// class PrefixTree {
//     constructor(...values) {
//         this.tree = [[]];
//         for (const [name, value] of values) {
//             this.set(name, value);
//         }
//     }

//     getTree() {
//         return this.tree;
//     }

//     set(name, value) {
//         name = String(name);
//         let current = this.tree;
//         if (name === '') {
//             current[1] = value;
//             return;
//         }
//         const list = name.split('');
//         for (let i = 0; i < list.length; i++) {
//             const char = list[i];
//             if (i === list.length - 1) {
//                 current[1] = value;
//             } else {
//                 let exist = false;
//                 const l = current[0].length;
//                 for (let j = 0; j < l; j++) {
//                     const [c, sub] = current[0][j];
//                     if (c === char) {
//                         current = sub;
//                         exist = true;
//                         break;
//                     }
//                 }
//                 if (!exist) {
//                     current[0][l] = [char, [[]]];
//                     current = current[0][l][1];
//                 }
//             }
//         }
//     }

//     get(name) {
//         let current = this.tree;
//         const list = name.split('');
//         for (let i = 0; i < list.length; i++) {
//             const char = list[i];
//             for (let j = 0; j < current[0].length; j++) {
//                 const [c, sub] = current[0][j];
//                 if (c === char) {
//                     current = sub;
//                     break;
//                 }
//                 if (j === current[0].length - 1) {
//                     return undefined;
//                 }
//             }
//         }
//         return current[1];
//     }
// }

// const tree = new PrefixTree();
// const obj = {};
// const map = new Map();

// console.time('Prefix Tree');
// for (let j = 0; j < 17; j++) {

//     for (let i = 0; i < 10000; i++) {
//         tree.set(String(Math.random()).slice(2, j), Math.random());
//     }
// }
// console.timeEnd('Prefix Tree');

// console.time('Native object');
// for (let j = 0; j < 17; j++) {
//     for (let i = 0; i < 10000; i++) {
//         obj[String(Math.random()).slice(2, j)] = Math.random();
//     }
// }
// console.timeEnd('Native object');

// console.time('Native Map');
// for (let j = 0; j < 17; j++) {
//     for (let i = 0; i < 10000; i++) {
//         map.set(String(Math.random()).slice(2, j), Math.random());
//     }
// }
// console.timeEnd('Native Map');


// console.log(tree.getTree());
// console.log(obj);

const o = {a: 1};

function e(object) {}

e(o);
