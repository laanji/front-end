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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
