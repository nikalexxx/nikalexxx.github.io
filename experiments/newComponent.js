

export {store} from '../store';

export const Example = Component.Example(
    ({props}) => {
        return () => {
            const {className} = props();
            const $ = store();
            const title = `counter = ${$.counter}`;
            return (
                <div className={className} onClick={() => $.counter++}>
                    {title}
                </div>
            )
        };
    }
)

export const Example2 = Component.Example2(
    () => () => <span>{store().counter + 2}</span>
)

export const Example3 = Component.Example3(
    ({props}) => {

        function changeName(user) {
            user.name = prompt('Enter name', 'Tom');
        }

        return () => {
            const {id} = props();
            const {users} = store();
            const user = users[id];
            const title = state(document).title;
            return (
                <div>
                    <p>{title}</p>
                    <p>{user.name}, {user.age}</p>
                    <p>
                        <button onClick={() => changeName(user)}>change name</button>
                        <button onClick={() => user.age++}> + year </button>
                        <button onClick={() => user.age--}> - year </button>
                    </p>
                </div>
            )
        };
    }
)
