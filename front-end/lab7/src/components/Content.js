import React from 'react';
import Image from './Image';

const IMAGE_SRC = process.env.PUBLIC_URL + '/images/Solkan1.JPG';
const START_WIDTH = 300;
const STEP = 40;
const MIN_WIDTH = 80;

// Компонент-клас. Стан images — масив ширин картинок (одна картинка = одна ширина).
// Кнопки працюють з останнім зображенням, як у лабораторній №4.
class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = { images: [START_WIDTH] };

        this.addImage = this.addImage.bind(this);
        this.enlargeImage = this.enlargeImage.bind(this);
        this.reduceImage = this.reduceImage.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    addImage() {
        this.setState((state) => ({ images: [...state.images, START_WIDTH] }));
    }

    // Змінює ширину останнього зображення на delta (з обмеженням знизу)
    changeLastWidth(delta) {
        this.setState((state) => {
            if (state.images.length === 0) {
                return null;
            }
            const images = [...state.images];
            const last = images.length - 1;
            images[last] = Math.max(MIN_WIDTH, images[last] + delta);
            return { images };
        });
    }

    enlargeImage() {
        this.changeLastWidth(STEP);
    }

    reduceImage() {
        this.changeLastWidth(-STEP);
    }

    deleteImage() {
        this.setState((state) => ({ images: state.images.slice(0, -1) }));
    }

    render() {
        return (
            <main>
                <p>
                    Освіта: Повна середня освіта, випускник школи "Оптіма", на разі студент 3-го курсу
                    КПІ ім. І. Сікорського, Факультету інформатики та обчислювальної техніки,
                    спеціальності 126 "Інформаційні системи і технології", освітньої програми
                    "Інформаційне забезпечення робототехнічних систем"
                </p>

                <p><b>Хобі та улюблені діяльності:</b></p>
                <ul>
                    <li>Футбол</li>
                    <li>Силові види спорту</li>
                    <li>Програмування SQL та C#</li>
                    <li>Музика</li>
                </ul>

                <p><b>Улюблені книги та фільми:</b></p>
                <ol>
                    <li>Книга: В. Франкл "Людина в пошуках сенсу"</li>
                    <li>Фільм: "Знайомтесь, Джо Блек"</li>
                    <li>Книга: Дж. Кемерон "Шлях митця"</li>
                </ol>

                <p><b>Про Солкан:</b></p>
                <p>
                    Солкан — це історичне стародавнє поселення, збудоване у 1001 році, розташоване у
                    західній Словенії, на кордоні з Італією. Сьогодні воно є передмістям та важливою
                    складовою частиною міста Нова Гориця. Місто лежить у мальовничій долині, де альпійська
                    річка Соча виходить на рівнину й устремляється до Адріатичного моря. Населення
                    становить близько 3 200 осіб.
                </p>
                <p>
                    <a href="https://uk.wikipedia.org/wiki/Солкан" target="_blank" rel="noreferrer">
                        Детальніше про Солкан
                    </a>
                </p>

                <div id="gallery">
                    {this.state.images.map((width, index) => (
                        <Image key={index} src={IMAGE_SRC} alt="Солкан" width={width} />
                    ))}
                </div>

                <div className="buttons">
                    <button type="button" onClick={this.addImage}>Додати</button>
                    <button type="button" onClick={this.enlargeImage}>Збільшити</button>
                    <button type="button" onClick={this.reduceImage}>Зменшити</button>
                    <button type="button" onClick={this.deleteImage}>Видалити</button>
                </div>
            </main>
        );
    }
}

export default Content;
