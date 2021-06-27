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
				document.getElementById('nima').style.display = 'block';
				document.getElementById('jest').style.display = 'none';
			} else {
				// znaleziono połączenie!
				wynikInfo.textContent = `Znaleziono połączenie!`;
				wynikInfo2.textContent = `Przewoźnikiem jest ${data.Carriers[0].Name}, cena biletu wynosi ${data.Quotes[0].MinPrice} $.`;
				//wyświetl kontener z wynikiem szukania
				document
					.getElementById('wynikSzukaniaButtons')
					.classList.remove('ukryte');
				document.getElementById('jest').style.display = 'block';
				document.getElementById('nima').style.display = 'none';
				// Zmiana widoku wyników zaleznie od ilości wybranych pasażerów + dodaj cenę biletu
				document.getElementById('szczegolyLotuForm').reset();
				// Ukryj widok szczegółów
				document.getElementById('szczegolyLotu').classList.add('ukryte');

				if (document.getElementById('liczbaPasazerow').value == 1) {
					document.getElementById('cena1').value = data.Quotes[0].MinPrice;
					document.getElementById('pasazer2').classList.add('ukryte');
					document.getElementById('pasazer3').classList.add('ukryte');
					document.getElementById('pasazer4').classList.add('ukryte');
				} else if (document.getElementById('liczbaPasazerow').value == 2) {
					document.getElementById('pasazer1').classList.remove('ukryte');
					document.getElementById('cena1').value = data.Quotes[0].MinPrice;
					document.getElementById('pasazer2').classList.remove('ukryte');
					document.getElementById('cena2').value = data.Quotes[0].MinPrice;
					document.getElementById('pasazer3').classList.add('ukryte');
					document.getElementById('pasazer4').classList.add('ukryte');
				} else if (document.getElementById('liczbaPasazerow').value == 3) {
					document.getElementById('pasazer1').classList.remove('ukryte');
					document.getElementById('cena1').value = data.Quotes[0].MinPrice;
					document.getElementById('pasazer2').classList.remove('ukryte');
					document.getElementById('cena2').value = data.Quotes[0].MinPrice;
					document.getElementById('pasazer3').classList.remove('ukryte');
					document.getElementById('cena3').value = data.Quotes[0].MinPrice;
				} else if (document.getElementById('liczbaPasazerow').value == 4) {
					document.getElementById('pasazer1').classList.remove('ukryte');
					document.getElementById('cena1').value = data.Quotes[0].MinPrice;
					document.getElementById('pasazer2').classList.remove('ukryte');
					document.getElementById('cena2').value = data.Quotes[0].MinPrice;
					document.getElementById('pasazer3').classList.remove('ukryte');
					document.getElementById('cena3').value = data.Quotes[0].MinPrice;
					document.getElementById('pasazer4').classList.remove('ukryte');
					document.getElementById('cena4').value = data.Quotes[0].MinPrice;
				}
			}
		})
		.catch((err) => {
			console.error(err);
		});
	event.preventDefault();
}

// dodawanie ceny bagażu do biletu
function dodajBagaz1() {
	const a = parseInt(document.getElementById('cena1').value);
	if (document.getElementById('bagaz1').checked) {
		document.getElementById('cena1').value = a + 5;
	} else {
		document.getElementById('cena1').value = a - 5;
	}
}
function dodajBagaz2() {
	const a = parseInt(document.getElementById('cena2').value);
	if (document.getElementById('bagaz2').checked) {
		document.getElementById('cena2').value = a + 5;
	} else {
		document.getElementById('cena2').value = a - 5;
	}
}
function dodajBagaz3() {
	const a = parseInt(document.getElementById('cena3').value);
	if (document.getElementById('bagaz3').checked) {
		document.getElementById('cena3').value = a + 5;
	} else {
		document.getElementById('cena3').value = a - 5;
	}
}
function dodajBagaz4() {
	const a = parseInt(document.getElementById('cena4').value);
	if (document.getElementById('bagaz4').checked) {
		document.getElementById('cena4').value = a + 5;
	} else {
		document.getElementById('cena4').value = a - 5;
	}
}

// wyświetlanie szczegółów lotu
function szczegolyLotu() {
	document.getElementById('wynikSzukania').classList.add('ukryte');
	document.getElementById('mapaButton').classList.remove('ukryte');
	document.getElementById('loginButton').classList.remove('ukryte');
	document.getElementById('szczegolyLotu').classList.remove('ukryte');
}

// Otwieranie mapy przyciskiem
document.getElementById('mapaButton').onclick = function () {
	console.log('obrazek samolotu');
	document.getElementById('mapa-okno').style.display = 'block';
	// Sprawdzanie jaki wyświetlić samolot zależnie od odległości lotu
	if (miejscePrzylotu.value == 'GDN-sky,Gdansk') {
		document.getElementById('modelSamolotu').src = './media/Embraer_175.jpg';
	} else if (miejscePrzylotu.value == 'LOND-sky,Londyn') {
		document.getElementById('modelSamolotu').src = './media/Airbus_A350.jpg';
	} else if (miejscePrzylotu.value == 'TLV-sky,Izrael') {
		document.getElementById('modelSamolotu').src = './media/Boeing_747.jpg';
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

function podsumowanie() {
	document.getElementById(
		'trasa'
	).textContent = `Start z lotniska "${lotSubmitData.Places[1].Name}" - Lądowanie na lotnisku "${lotSubmitData.Places[0].Name}".`;
	document.getElementById(
		'przewoznik'
	).textContent = `Przewoźnik: ${lotSubmitData.Carriers[0].Name}.`;
	document.getElementById('dataPod').textContent = `Data wylotu: ${
		document.getElementById('dataWylotu').value
	}.`;
	document.getElementById('pasazerowie').textContent = `Ilość pasażerów: ${
		document.getElementById('liczbaPasazerow').value
	}.`;
	document.getElementById(
		'koszt'
	).textContent = `Łączny koszt z ewentualnymi bagażami (+5$) to ${
		parseInt(document.getElementById('cena1').value) +
		parseInt(document.getElementById('cena2').value) +
		parseInt(document.getElementById('cena3').value) +
		parseInt(document.getElementById('cena4').value)
	}`;
}

// LOGOWANIE
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
			console.log(data.users);
			// sprawdzenie czy wpisane dane znajdują się w pliku json
			users.forEach((entry) => {
				if (entry.name === login.value && entry.password === password.value) {
					alert('Pomyślnie zalogowano'); //pomyślne logowanie
					document.getElementById('logowanie').reset(); //zresetuj okno logowania
					document.getElementById('login-okno').style.display = 'none'; //schowaj okno logowania
					document.getElementById('container').style.display = 'none'; //schowaj wyszukiwanie
					document.getElementById('wynikBox').style.display = 'none';
					document.getElementById('podsumowanie').style.display = 'flex'; //pokaż okno podsumowania
					podsumowanie();
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
			// coś jak error
		});
	event.preventDefault();
}
