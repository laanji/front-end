import React from 'react';
import Header from './components/Header';
import Content from './components/Content';
import Goods from './components/Goods';

function App() {
    return (
        <div className="page">
            <h3 className="task-title">Завдання 1. Сторінка з лабораторної №4 на React</h3>
            <Header name="Друченко Олексій Сергійович" />
            <Content />

            <h3 className="task-title">Завдання 2. Галерея товарів</h3>
            <Goods />
        </div>
    );
}

export default App;
