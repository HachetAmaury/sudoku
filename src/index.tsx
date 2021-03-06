import React from 'react';
import { render } from 'react-dom';

import styled from 'styled-components';

const Title = styled.h1`
    font-size: 1.5em;
    text-align: center;
    color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
    padding: 4em;
    background: papayawhip;
`;

render(
    <Wrapper>
        <Title>Hello World!</Title>
    </Wrapper>,
    document.querySelector('#root'),
);

function sum(firstParam: number, secondParam: number) {
    return firstParam + secondParam;
}

console.log(sum(3, 4));
