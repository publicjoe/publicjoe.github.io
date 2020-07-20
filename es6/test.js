/* let employees = [
    {name: 'Dave', salary: 20000},
    {name: 'Dozey', salary: 19500},
    {name: 'Beaky', salary: 18000},
    {name: 'Mick', salary: 21500},
    {name: 'Titch', salary: 19000}
];

const totalSalary = employees.reduce(function (acc, curr) {
    return acc + curr.salary;
}, 0);

console.log(totalSalary); */

const document = [ { _id: '5eff24ac4475752328897106',
    recipientId: '2680718838724424' } ];

console.log(JSON.stringify(document[0]));

const length = Object.keys(JSON.parse(JSON.stringify(document[0]))).length;

console.log(length);