var users = [{name: 'Jack', age: 30}, {name: 'John', age: 29}];

var oper = function(a, b){
    return a + b;
};

users.push(oper);

console.dir(users);
console.log('세번째 배렬 요소로 함수로 실행 : ' + users[2](10,10));