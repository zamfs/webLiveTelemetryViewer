const serverUrl = "https://transmissorlivetelemetry.onrender.com";

const socket = io(serverUrl);
const gridContainer = document.getElementById('gridContainer');

socket.on('grid_atual', (cars) => {
    if (cars.length > 0) {
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) emptyState.remove();
    }

    cars.forEach(car => {
        let card = document.getElementById(car.sessionKey);

        if (!card) {
            card = document.createElement('div');
            card.id = car.sessionKey;
            card.className = 'car-card';

            card.innerHTML = `
                <div class="driver-name">${car.driverName}</div>
                <div class="car-info"><strong>Car:</strong> ${car.carModel}</div>
                <div class="car-info"><strong>Track:</strong> ${car.trackName}</div>
            `;

            //Redirect to individual dashboard giving the ID as URL parameter
            card.onclick = () => {
                //window.location.href = `dashboard.html?carId=${car.carId}`;
                window.location.href = `dashboard.html?sessionKey=${car.sessionKey}`
            };

            gridContainer.appendChild(card);
        }
    });

    //clean the screen with the disconnected drivers
    const currentSessionKeys = cars.map(c => c.sessionKey);
    document.querySelectorAll('.car-card').forEach(card => {
        if (!currentSessionKeys.includes(card.id)) {
            card.remove(); //if the id is not in server array, he is removed
        }
    });
});