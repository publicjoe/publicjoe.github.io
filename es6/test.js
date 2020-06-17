function foo(a,b,...args) {
    console.log(sum(...args));
}

function sum(...args) {
    return args.filter(e => typeof e === 'number')
        .reduce((prev, curr)=> prev + curr);
}

foo(1,2,3,'A',4,'B',5,'C'); // Output is 12
