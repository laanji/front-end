const url = 'https://randomuser.me/api/?results=5';
const button = document.getElementById('download-btn');
const status = document.getElementById('status');
const container = document.getElementById('users');

function addLine(parent, label, value) {
    const line = document.createElement('p');
    line.textContent = label + ': ' + value;
    parent.appendChild(line);
}

function createCard(user) {
    const card = document.createElement('div');
    card.className = 'card';

    const picture = document.createElement('img');
    picture.src = user.picture.large;
    picture.alt = 'Фото користувача';
    card.appendChild(picture);

    const info = document.createElement('div');
    info.className = 'info';
    addLine(info, 'Cell', user.cell);
    addLine(info, 'City', user.location.city);
    addLine(info, 'E-mail', user.email);
    addLine(info, 'Coordinates', user.location.coordinates.latitude + ', ' + user.location.coordinates.longitude);
    card.appendChild(info);

    return card;
}

button.addEventListener('click', () => {
    status.textContent = 'loading...';

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        })
        .then((data) => {
            container.innerHTML = '';
            data.results.forEach((user) => {
                container.appendChild(createCard(user));
            });
            status.textContent = 'success!';
        })
        .catch((error) => {
            status.textContent = 'error: ' + error.message;
        });
});