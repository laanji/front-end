const goodsBase = 'images/goods/';

// Щоб замінити заглушки на справжні фото — поклади файли в images/goods/
// і зміни розширення (наприклад, 'headphones.jpg').
const goods = [
    { id: 1, photo: goodsBase + 'headphones.svg', name: 'Навушники Sony WH-CH520', price: 2299 },
    { id: 2, photo: goodsBase + 'keyboard.svg',   name: 'Клавіатура Logitech K380', price: 1499 },
    { id: 3, photo: goodsBase + 'mouse.svg',      name: 'Миша Logitech M185',       price: 549 },
    { id: 4, photo: goodsBase + 'monitor.svg',    name: 'Монітор Samsung 24"',      price: 5799 },
    { id: 5, photo: goodsBase + 'webcam.svg',     name: 'Вебкамера Logitech C270',  price: 1199 },
    { id: 6, photo: goodsBase + 'speaker.svg',    name: 'Колонка JBL Go 3',         price: 1699 }
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
