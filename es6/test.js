let employees = [
    {name: 'Dave', salary: 20000},
    {name: 'Dozey', salary: 19500},
    {name: 'Beaky', salary: 18000},
    {name: 'Mick', salary: 21500},
    {name: 'Titch', salary: 19000}
];

const empSalaries = employees.map((emp) => emp.salary);

const totalSalary = empSalaries.reduce((sum,value)=>sum+value, 0);

console.log(totalSalary);

const salaryTotal = employees.reduce(function (acc, curr) {
    return acc + curr.salary;
}, 0);

console.log(salaryTotal);