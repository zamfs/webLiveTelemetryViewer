const serverUrl = "http://150.230.230.27:3000";
//local test
//const serverUrl = "http://localhost:3000";

const socket = io(serverUrl);
const gridContainer = document.getElementById('gridContainer');

socket.on('grid_atual', (cars) => {
    if (cars.length > 0) {
        const emptyState = document.querySelector('.empty-state');
        if (emptyState) emptyState.remove();
    }

    cars.forEach(car => {
        let card = document.getElementById(car.publicToken);

        if (!card) {
            card = document.createElement('div');
            card.id = car.publicToken;
            //Redirect to individual dashboard giving the ID as URL parameter
            card.onclick = () => {
            
                window.location.href = `dashboard.html?token=${car.publicToken}`
            };

            gridContainer.appendChild(card);
        }

        card.className = car.isActive ? 'car-card' : 'car-card offline';

        const statusText = car.isActive ? 'On track' : 'On box / Offiline';
        
        card.innerHTML = `
            <div class="driver-name">${car.driverName}</div>
            <div class="car-info"><strong>Car:</strong> ${car.carModel}</div>
            <div class="car-info"><strong>Track:</strong> ${car.trackName}</div>
            <div class="car-info" style="margin-top: 10px; font-size: 0.8rem;">${statusText}</div>
        `;
    });

    //clean the screen with the disconnected drivers
    const currentTokens = cars.map(c => c.publicToken);
    document.querySelectorAll('.car-card').forEach(card => {
        if (!currentTokens.includes(card.id)) {
            card.remove(); //if the id is not in server array, he is removed
        }
    });
});