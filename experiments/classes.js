const Person = Class(({_this, private, static}) => ({
    constructor: (name) => {
        _this.name = name;
    },
    nameView: private(name => name.toUpperCase()),
    type: static('person'),
    getName: () => _this.nameView(_this.name)
}));

const v = Person.new('вася');
console.log(v.getName()); // ВАСЯ
console.log(v.nameView('')); // error
console.log(Person.type); // person

const User = Class.extends(Person)(({_this, _super}) => ({
    constructor: ({name, age, sex}) => {
        _super(name);
        _this.age = age;
        _this.sex = sex;
    },
    type: static('user'),
    getInfo: () => `${_this.getName()}, ${_this.age} years, ${_this.sex}`
}));

const f = User.new({name: 'федя', age: 35, sex: 'M'});
console.log(f.getName()); // ФЕДЯ
console.log(f.getInfo()); // ФЕДЯ, 35 years, M
console.log(f.nameView('')); // error
console.log(User.type); // user

