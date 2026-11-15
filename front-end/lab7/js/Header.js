const { useState } = React;

// Дві колірні схеми для кожного елемента (як у лабораторній №4)
const authorSchemes = [
    { backgroundColor: '#0000ff', color: '#ffffff' },
    { backgroundColor: '#ffff00', color: '#000000' }
];

const birthSchemes = [
    { backgroundColor: '#00ff00', color: '#000000' },
    { backgroundColor: '#ff00ff', color: '#ffffff' }
];

// Компонент-функція. Отримує ПІБ через props.
// -1 = елемент ще не натискали; кожен клік перемикає схему 0 <-> 1.
function Header(props) {
    const [authorScheme, setAuthorScheme] = useState(-1);
    const [birthScheme, setBirthScheme] = useState(-1);

    const next = (current) => (current === 0 ? 1 : 0);

    return (
        <header>
            <h2
                id="author-name"
                style={authorScheme >= 0 ? authorSchemes[authorScheme] : undefined}
                onClick={() => setAuthorScheme(next(authorScheme))}
            >
                {props.name}
            </h2>

            <p
                className="birth-info"
                style={birthScheme >= 0 ? birthSchemes[birthScheme] : undefined}
                onClick={() => setBirthScheme(next(birthScheme))}
            >
                Дата і місце народження: 31 липня 2007 року, м. Київ
            </p>
        </header>
    );
}
