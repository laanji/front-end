// Компонент-функція. Параметри передаються через props: src, alt, width.
function Image(props) {
    return <img src={props.src} alt={props.alt} width={props.width} />;
}
