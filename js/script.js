/**
 * Estado da aplicação (state)
 */
let tabFoundPeople = null; // aba que tem a lista de países
let tabEstatisticas = null; // aba que tem a lista de favoritos

let allPeople = []; //vetor que será preenchido pelo request
let allSearchedPeople = [];
let homens = [];
let mulheres = [];
let nomeBuscado = null;

let countPeopleFound = 0; // contar total de países

let totalHomens = 0;
let totalMulheres = 0;
let somaIdades = 0;
let mediaIdades = 0;
let nameInput = null;
let numberFormat = null;
let buttonBusca = null;

window.addEventListener('load', () => {
  inputName = document.querySelector('#inputName');
  tabFoundPeople = document.querySelector('#tabFoundPeople');
  tabEstatisticas = document.querySelector('#tabEstatisticas');
  countPeopleFound = document.querySelector('#countPeopleFound');
  totalHomens = document.querySelector('#totalHomens');
  totalMulheres = document.querySelector('#totalMulheres');
  somaIdades = document.querySelector('#somaIdades');
  mediaIdades = document.querySelector('#mediaIdades');
  buttonBusca = document.querySelector('#buttonBusca');

  fetchPeople();
  render();
  activateInput();
  preventFormSubmit();
});
/**
 *
 */
async function fetchPeople() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=1000&nat=BR&noinfo'
  );
  const json = await res.json();
  allPeople = json.results.map((person) => {
    // USANDO DESTRUCTURING
    const { name, dob, picture, gender } = person;
    return {
      firstName: name.first,
      lastName: name.last,
      fullName: juntaNome(name.first, name.last),
      age: dob.age, // as variáveis que tiverem o mesmo nome no destruction pode deixar assim
      gender,
      picture: picture.medium,
    };
  });

  console.log(allPeople);
  render();
}

function render() {
  renderSearchPeople();
  renderEstatistica();
}

function renderSearchPeople() {
  let peopleHTML = '<div>';
  allSearchedPeople.sort((a, b) => {
    return a.firstName.localeCompare(b.firstName);
  });
  allSearchedPeople.forEach((person) => {
    const { firstName, lastName, age, picture } = person;

    const personHTML = `
    <div class='person'>
      <div>
        <img src="${picture}" alt="${name}">
      </div>
      <div>
        <ul>
        <li>${firstName} ${lastName} </li>
          <li>${age}</li>
        </ul>
      </div>
  </div>   
    `;

    peopleHTML += personHTML;
  });

  peopleHTML += '</div>';
  tabFoundPeople.innerHTML = peopleHTML;
}

function renderEstatistica() {
  countPeopleFound.textContent = allSearchedPeople.length;

  const vetorHomens = allSearchedPeople.filter((person) => {
    return person.gender === 'male';
  });
  const vetorMulheres = allSearchedPeople.filter((person) => {
    return person.gender === 'female';
  });

  const totalIdade = allSearchedPeople.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  const mediaTotal = totalIdade / allSearchedPeople.length;

  somaIdades.textContent = totalIdade;
  totalHomens.textContent = vetorHomens.length;
  totalMulheres.textContent = vetorMulheres.length;
  mediaIdades.textContent = parseFloat(mediaTotal.toFixed(2));
}

function preventFormSubmit() {
  function handleFormSubmit(event) {
    event.preventDefault();
  }
  var form = document.querySelector('form');
  form.addEventListener('submit', handleFormSubmit);
}

function activateInput() {
  function handleTyping(event) {
    let nomeBuscado = event.target.value;
    if (event.key === 'Enter' && event.target.value.trim() !== '') {
      allSearchedPeople = allPeople.filter((person) => {
        return person.fullName
          .toLowerCase()
          .includes(nomeBuscado.toLowerCase());
      });
      console.log(allSearchedPeople);
      render();
    }
  }
  inputName.focus();
  inputName.addEventListener('keyup', handleTyping);
}

function juntaNome(firstName, lastName) {
  let todaPorraNome = `${firstName} ${lastName}`;
  return todaPorraNome;
}
