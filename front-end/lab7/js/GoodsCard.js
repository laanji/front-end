function GoodsCard(props) {
    return (
        <div className="goods-card">
            <img src={props.photo} alt={props.name} />
            <h4>{props.name}</h4>
            <p className="price">{props.price} грн</p>
        </div>
    );
}
