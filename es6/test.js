let employees = [
    {name: 'Dave', salary: 20000},
    {name: 'Dozey', salary: 19500},
    {name: 'Beaky', salary: 18000},
    {name: 'Mick', salary: 21500},
    {name: 'Titch', salary: 19000}
];

const totalSalary = employees.reduce(function (acc, curr) {
    return acc + curr.salary;
}, 0);

console.log(totalSalary);