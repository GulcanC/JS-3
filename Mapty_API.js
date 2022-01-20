'use strict';

// prettier-ignore

// class Workout. managing workout data creating classes
class Workout {
  date = new Date();
  // use the current date to create a new ID. Convert it to stirng and take the last 10 numbers
  id = (Date.now() + ' ').slice(-10);
  click= 0;
  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
    // last part, when you click the event the map move to show concernant pop-up
  }

  // set description for date

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
  click() {
    this.click++;
  }
}

//25. create a global variable "map"
// let map, mapEvent;
//31. Use constructor method to set the code according to architecture
class Running extends Workout {
  type = 'running';
  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }
  // calculate pace min/km
  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}
class Cycling extends Workout {
  type = 'cycling';
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }
  // calculate speed, km/h
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}
// create a variable for run latitude:39, longitude:-12, distannce:5.2km, duration:24  min, step:178
const run1 = new Running([39, -12], 5.2, 24, 178);
// create a variable for cycling latitude:39, longitude:-12, distance:27 km, duration:95min, elevationGain:523 m
const cycling1 = new Cycling([39, -12], 27, 95, 523);
console.log(run1, cycling1);
// ***APLICATION ARCHITECTURE
const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  // private class field, private properties
  // object properties
  #map;
  #mapZoomLevel = 13;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPosition();

    //get data from local storage
    this._getLocalStorage();
    //24. add submit event to event listener. when we submit the information popup will be opened
    form.addEventListener('submit', this._newWorkout.bind(this));

    //27. For input types, when you select running cadence occur, when you select cycling elev gain ocuurs. to do that. In html file "elev gain" is hidden and "cadence" is appear. Use change event
    //28. Use closest method to chose parent, and use toggle method to toggle.
    inputType.addEventListener('change', this._toggleElevationField);
    // last part add event listener when you click the evenet map will move
    // after that when we click the container consol show to us a <li element. here id is important.
    // when we click the outside of this container it results as null

    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    //1. Create a function to reach the current function. This function takes as an input two functions. First one is to Callback function that will be called on succes, The browser succesfully got the coordinates of current position of user. second callback is Error callback which is the one that is gonna be called when there happned an error  while getting the coordinates.
    //2. defie two function. Succes one and Error one
    //3. start with the second one (error one) an alert.
    //4. the first one is called with a parameter which we call the Position Parameter. JS will call this function if there is a succes.
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    //  console.log(position);
    //5. create a variable called latitude and longtitude based out of the latitude property of this object.
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];
    // console.log(`My current latitude: ${latitude} and my current longitude ${longitude}` );
    //6. create a link for current position. You can use it for HTML file
    //7. add link to html file for third party library "Leaflet"
    // console.log(`https://www.google.fr/maps/@${latitude},${longitude}`);
    //8. noW at the page leaflet in the section overwiev copy paste this function
    // 9. make the var as const. Here "map" is class name of an empty div element in HTML. L is leaflet
    //10. We will reach the current place of this site Leaflet.
    //11. now create a other js file. for me it is not necessary but he did it.
    //12. Now I will add my own coordinate to this code. To do that I will add an array for coordinates

    // change 13 here for zoom level
    // this.#map = L.map('map').setView(coords, 13);
    console.log(this);
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
    //13. This part is stylable. You can find at google different style. this is default I will change it.
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    //16. now make command this code
    /* 
    L.marker(coords)
      .addTo(map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();
      */

    //14. add event listener to the map. this code comes from leaflet library.
    //23.  map.on('click', function (mapEvent) {
    //15. now when you clicked on the map you will see the coordinates. And when you write it to console you will see the coordinates as "latlng" lattitude and "longitude"
    // 23. console.log(mapEvent);
    //17. now create a marker but this marker occurs just at the center of map. we want to see pop up where we click.

    // 23. const { lat, lng } = mapEvent.latlng;
    //18. change the coords with [lat, lng]
    // L.marker(coords)
    // 23.  L.marker([lat, lng]).addTo(map);
    //23. now we want to see hidden form when we click on the map. fisrt make command some parts
    this.#map.on('click', this._showForm.bind(this));
    //19. Change "bindPopup with workout". Now you will see, when you click any where at the map, pop up will be open. but when we click ancient pop up closes when new one occurs. but we want to see all pop up open. for that use "autoClose:false"
    //20. go to leaflet library and open marker to schange some style. we will add changes to "bindPopup"
    // .bindPopup('Workout')
    //23.  .bindPopup(
    //23.  L.popup({
    //23.   maxWidth: 250,
    //23.    minWidth: 100,
    //23.   autoClose: false,
    //23.   closeOnClick: false,
    //23.    className: 'running-popup',
    //23.    })
    //23.    )
    //21. now I want to add some content to my popup. Use leaflet library "method" "setPopupContent"
    //22. now we want to see hidden form when we click on the map.
    //23.  .setPopupContent('Workout')
    //23.  .openPopup();
    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    //empty inputs
    //hide form and Clear input fields

    // Empty inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }
  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    //data should be number.ıf the data is not a number, return it immidiatly as an alert

    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));
    // check positive numbers(...inputs means arbitrary amount of inputs)
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    e.preventDefault();

    // Get data from form
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (
        // !Number.isFinite(distance) ||
        //  !Number.isFinite(duration) ||
        //  !Number.isFinite(cadence)
        // if not valid inputs show this alert
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      )
        return alert('Inputs have to be positive numbers!');
      // create running object. push that object to the workout array

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    // if workout cycling, create cycling object
    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (
        // !Number.isFinite(distance) ||
        //  !Number.isFinite(duration) ||
        //  !Number.isFinite(elevation)
        // if not valid inputs show this alert. burada elevation positiv olmak zorunda değil çünkü yükseklik - olabilir.
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration)
      )
        return alert('Inputs have to be positive numbers');
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //add new object to workout array for both running and cycling
    this.#workouts.push(workout);
    console.log(workout);
    // to see the object
    // render workout on map as marker
    this._renderWorkoutMarker(workout);
    this._renderWorkout(workout);
    // hide form and clear input fields
    this._hideForm();
    // set local storage to all work outs
    this._setLocalStorage();
    // render workout  on list
  }
  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      // add imoji to pop-up
      .setPopupContent(
        `${workout.type === 'running' ? '🏃' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();
  }
  _renderWorkout(workout) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence}</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevationGain}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(e) {
    // BUGFIX: When we click on a workout before the map has loaded, we get an error. But there is an easy fix:

    const workoutEl = e.target.closest('.workout');
    console.log(workoutEl);
    // using the public interface
    // workout.click();

    if (!workoutEl) return;

    const workout = this.#workouts.find(
      work => work.id === workoutEl.dataset.id
    );
    console.log(workout);
    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));
    console.log(data);
    if (!data) return;

    this.#workouts = data;
    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }
  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}
const app = new App();
