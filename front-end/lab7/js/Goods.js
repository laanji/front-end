const goodsBase = 'images/goods/';

const goods = [
    { id: 1, photo: goodsBase + 'band.jpg', name: 'Повязка на голову', price: 150 },
    { id: 2, photo: goodsBase + 'book.jpg',   name: 'Марк Лівін "Простими словами"', price: 690 },
    { id: 3, photo: goodsBase + 'boots.jpg',      name: 'Футбольні бутси',       price: 2500 },
    { id: 4, photo: goodsBase + 'brelok.jpg',    name: 'Брелок Stitch',      price: 499 },
    { id: 5, photo: goodsBase + 'meme.jpg',     name: 'Бомбардіро Крокоділо',  price: 9999 },
    { id: 6, photo: goodsBase + 'notebook.jpg',    name: 'Ноутбук ASUS',         price: 25000 }
];

function Goods() {
    return (
        <div className="goods">
            {goods.map((item) => (
                <GoodsCard
                    key={item.id}
                    photo={item.photo}
                    name={item.name}
                    price={item.price}
                />
            ))}
        </div>
    );
}
