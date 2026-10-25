const rules = [
    { id: 'fullname', label: 'ПІБ', pattern: /^\p{Lu}\p{Ll}+\s\p{Lu}\.\p{Lu}\.$/u },
    { id: 'group', label: 'Група', pattern: /^\p{Lu}{2}-\d{2}$/u },
    { id: 'phone', label: 'Телефон', pattern: /^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/ },
    { id: 'address', label: 'Адреса', pattern: /^м\.\s\p{L}[\p{L}\s-]*$/u },
    { id: 'email', label: 'E-mail', pattern: /^[a-z0-9._]+@[a-z0-9]+\.com$/i }
];

const form = document.getElementById('user-form');
const resultBox = document.getElementById('result');

rules.forEach((rule) => {
    const input = document.getElementById(rule.id);
    input.addEventListener('input', () => {
        input.closest('.row').classList.remove('error');
    });
});

function showData() {
    let html = '<h3>Введені дані</h3>';
    rules.forEach((rule) => {
        const value = document.getElementById(rule.id).value.trim();
        html += '<p><b>' + rule.label + ':</b> ' + value + '</p>';
    });

    const win = window.open('', '_blank', 'width=420,height=360');
    if (win) {
        win.document.write('<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8"><title>Введені дані</title></head><body style="font-family: Arial, sans-serif; padding: 16px;">' + html + '</body></html>');
        win.document.close();
    } else {
        resultBox.innerHTML = html;
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    resultBox.innerHTML = '';
    let isValid = true;

    rules.forEach((rule) => {
        const input = document.getElementById(rule.id);
        const isCorrect = rule.pattern.test(input.value.trim());
        input.closest('.row').classList.toggle('error', !isCorrect);
        if (!isCorrect) {
            isValid = false;
        }
    });

    if (isValid) {
        showData();
    }
});

const variant = 10;
const size = 6;
const table = document.getElementById('grid');
const palette = document.getElementById('palette');

for (let r = 0; r < size; r++) {
    const row = table.insertRow();
    for (let c = 0; c < size; c++) {
        const cell = row.insertCell();
        cell.textContent = r * size + c + 1;
    }
}

const target = table.rows[Math.floor((variant - 1) / size)].cells[(variant - 1) % size];
target.classList.add('target');

function randomColor() {
    return '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
}

target.addEventListener('mouseover', () => {
    target.style.backgroundColor = randomColor();
});

target.addEventListener('click', () => {
    target.style.backgroundColor = palette.value;
});

target.addEventListener('dblclick', () => {
    const row = target.parentElement;
    for (let i = target.cellIndex; i < row.cells.length; i += 2) {
        row.cells[i].style.backgroundColor = palette.value;
    }
});