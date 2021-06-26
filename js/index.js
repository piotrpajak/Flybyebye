// zegar
window.onload = displayClock();
function displayClock() {
	var display = new Date().toLocaleTimeString();
	document.getElementById('zegar').innerHTML = display;
	setTimeout(displayClock, 1000);
}
// data
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;
document.getElementById('data').textContent = today;

// WYLOT miasto i pogoda
let miejsceWylotu = document.getElementById('miejsceWylotu');
miejsceWylotu.addEventListener('change', () => {
	fetch(
		`https:api.openweathermap.org/data/2.5/weather?q=${
			miejsceWylotu.value.split(',')[1]
		}&appid=35d619a1807b5147986aba2eba029146`
	)
		.then((resp) => resp.json()) //mówimy, ze pobrane dane to JSON
		.then((data) => {
			//data = pobrane dane
			console.log(data);

			document.getElementById('prognozaA').textContent = `Aktualna pogoda:`;

			celcjusze = Math.round(data.main.temp - 273.15);
			document.getElementById('tempA').textContent = `Temp.: ${celcjusze} °C.`;

			paskale = data.main.pressure;
			document.getElementById(
				'pressureA'
			).textContent = `Ciś.: ${paskale} hPa.`;

			document.getElementById(
				'windA'
			).textContent = `Wiatr: ${data.wind.speed} m/s`;

			document.getElementById(
				'obrazekA'
			).src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

			document.getElementById(
				'weatherA'
			).textContent = `${data.weather[0].description}`;
		});
});
// PRZYLOT miasto i pogoda
let miejscePrzylotu = document.getElementById('miejscePrzylotu');
miejscePrzylotu.addEventListener('change', () => {
	fetch(
		`https:api.openweathermap.org/data/2.5/weather?q=${
			miejscePrzylotu.value.split(',')[1]
		}&appid=35d619a1807b5147986aba2eba029146`
	)
		.then((resp) => resp.json()) //mówimy, ze pobrane dane to JSON
		.then((data) => {
			//data = pobrane dane
			console.log(data);
			document.getElementById('prognozaB').textContent = `Aktualna pogoda:`;

			celcjusze = Math.round(data.main.temp - 273.15);
			document.getElementById('tempB').textContent = `Temp.: ${celcjusze} °C.`;

			paskale = data.main.pressure;
			document.getElementById(
				'pressureB'
			).textContent = `Ciś.: ${paskale} hPa.`;

			document.getElementById(
				'windB'
			).textContent = `Wiatr: ${data.wind.speed} m/s`;

			document.getElementById(
				'obrazekB'
			).src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

			document.getElementById(
				'weatherB'
			).textContent = `${data.weather[0].description}`;
		});
});
// DATA lotu
const dataWylotu = document.getElementById('dataWylotu');
// Szukanie lotu po wybraniu trasy i naciśnięciu guzika 'szukaj' pobieranie danych z <form>
let lotSubmitData = {}; //globalna zmienna na wyniki szukania lotów z API
const szukajLotu = document.getElementById('szukajLotu');
szukajLotu.addEventListener('submit', lotSubmit);
function lotSubmit(event) {
	// pobieranie danych z api na podstawie danych z <form>
	fetch(
		`https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/PL/USD/pl-PL/${
			miejsceWylotu.value.split(',')[0]
		}/${miejscePrzylotu.value}/${dataWylotu.value}`,
		{
			method: 'GET',
			headers: {
				'x-rapidapi-key': '769d1a9feamsh828a16f35a138c1p1c2104jsn850104444ebd',
				'x-rapidapi-host':
					'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com',
			},
		}
	)
		.then((resp) => resp.json()) // fetch do json
		.then((data) => {
			lotSubmitData = data; //zapisz znalezione dane do zmeinnej
			document.getElementById('wynikSzukania').classList.remove('ukryte');
			// sprawdzanie czy istnieje połączenie i czy jest bezpośrednie (odrzuca jeśli jest więcej niż 1 na potrzeby projektu)
			if (data.Carriers.length == 0 || data.Quotes[0].Direct == false) {
				wynikInfo.textContent = 'Brak wyników. Szukaj dalej.'; // brak połączenia
			} else {
				wynikInfo.textContent = `Znaleziono połączenie! Przewoźnikiem jest ${data.Carriers[0].Name}, cena biletu wynosi ${data.Quotes[0].MinPrice} $.`; // znaleziono połączenie!
				document
					.getElementById('wynikSzukaniaButtons') //wyświetl kontener z wynikiem szukania
					.classList.remove('ukryte');
			}
		})
		.catch((err) => {
			console.error(err);
		});
	event.preventDefault();
}

// wyświetlanie szczegółów lotu
function szczegolyLotu() {
	// document.getElementById('wynikSzukania').classList.add('ukryte');
	document.getElementById('mapaButton').classList.remove('ukryte');
	document.getElementById('szczegolyLotu').classList.remove('ukryte');
	console.log(lotSubmitData);
	// document.getElementById('szczegoly_1').textContent = `Start z lotniska "${lotSubmitData.Places[1].Name}" - Lądowanie na lotnisku "${lotSubmitData.Places[0].Name}".`;
	// document.getElementById('szczegoly_2').textContent = `Przewoźnik: ${lotSubmitData.Carriers[0].Name}.`;
	// document.getElementById('szczegoly_3').textContent = `Data wylotu: ${lotSubmitData.OutboundDates[0].PartialDate}.`;
}

// Otwieranie mapy przyciskiem
document.getElementById('mapaButton').onclick = function () {
	document.getElementById('mapa-okno').style.display = 'block';
	// Sprawdzanie jaki wyświetlić samolot zależnie od odległości lotu
	if (miejscePrzylotu.value == 'GDN-sky,Gdansk') {
		document.getElementById('modelSamolotu').src = '/media/Embraer_175.jpg';
	} else if (miejscePrzylotu.value == 'LOND-sky,Londyn') {
		document.getElementById('modelSamolotu').src = '/media/Airbus_A350.jpg';
	} else if (miejscePrzylotu.value == 'CAI-sky,Kair') {
		document.getElementById('modelSamolotu').src = '/media/Boeing_747.jpg';
	} else document.getElementById('modelSamolotu').src = '';
};
// Zamykanie mapy X
document.getElementsByClassName('close')[0].onclick = function () {
	document.getElementById('mapa-okno').style.display = 'none';
};
// Zamykanie mapy klikając dookoła
window.onclick = function (event) {
	if (event.target == document.getElementById('mapa-okno')) {
		document.getElementById('mapa-okno').style.display = 'none';
	} else if (event.target == document.getElementById('login-okno')) {
		document.getElementById('login-okno').style.display = 'none';
	}
};

// Otwieranie logowania przyciskiem
document.getElementById('loginButton').onclick = function () {
	document.getElementById('login-okno').style.display = 'block';
	document.getElementsByClassName('logowanie')[0].style.display = 'block';
	document.getElementsByClassName('rejestracja')[0].style.display = 'none';
};
// Zamykanie logowania X
document.getElementsByClassName('closeLogin')[0].onclick = function () {
	document.getElementById('login-okno').style.display = 'none';
};
// Przełączanie z logowania na rejestrację
document.getElementById('regBtn').onclick = function () {
	document.getElementsByClassName('logowanie')[0].style.display = 'none';
	document.getElementsByClassName('rejestracja')[0].style.display = 'block';
};
// Przełączanie z rejestracji na logowanie
document.getElementById('logBtn').onclick = function () {
	document.getElementsByClassName('logowanie')[0].style.display = 'block';
	document.getElementsByClassName('rejestracja')[0].style.display = 'none';
};

// LOGOWANIE
// const users = JSON.parse(users.json);
// console.log(users)
const logowanie = document.getElementById('logowanie');
logowanie.addEventListener('submit', logSubmit);
function logSubmit(event) {
	//  Pobieranie pliku JSON
	fetch('/users/users.json')
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			const login = document.getElementById('login');
			const password = document.getElementById('password');
			const users = data.users;
			users.forEach((entry) => {
				if (entry.name === login.value && entry.password === password.value) {
					alert('Pomyślnie zalogowano');
					document.getElementById('logowanie').reset();
					document.getElementById('login-okno').style.display = 'none';
				} else if (
					entry.name !== login.value &&
					entry.password === password.value
				) {
					alert('Błędny login!');
					document.getElementById('logowanie').reset();
				} else if (
					entry.name === login.value &&
					entry.password !== password.value
				) {
					alert('Błędne hasło!');
					document.getElementById('logowanie').reset();
				}
			});
		})
		.catch((err) => {
			// Do something for an error here
		});
	event.preventDefault();
}
