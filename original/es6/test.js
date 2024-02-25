checkBedrooms = (toCheck) => {
let valueValid = false;
    const minimumBedrooms = 1;

    if ((parseInt(toCheck, 10) >= minimumBedrooms)) {
      valueValid = true;
    }
    return valueValid;
}

let valid = checkBedrooms(4);
console.log(`4 is ${valid}`);

valid = checkBedrooms(0);
console.log(`0 is ${valid}`);