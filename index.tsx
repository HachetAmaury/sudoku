import React from 'react';
import { render } from 'react-dom';

render(<div>Hello world from React!</div>, document.querySelector('#root'));

function sum(firstParam: number, secondParam: number) {
    return firstParam + secondParam;
}

console.log(sum(3, 4));
