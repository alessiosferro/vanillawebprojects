new (class {
  apiUrl = 'https://randomuser.me/api';
  data = [];

  constructor() {
    this.mainElem = document.getElementById('main');
    this.addUserBtn = document.getElementById('add-user');
    this.doubleBtn = document.getElementById('double');
    this.showMillBtn = document.getElementById('show-millionaires');
    this.sortBtn = document.getElementById('sort');
    this.calcWealthBtn = document.getElementById('calculate-wealth');

    this.addEventListeners();
    this.getInitialData();
  }

  addEventListeners() {
    this.addUserBtn.addEventListener('click', () => this.addUser());
    this.doubleBtn.addEventListener('click', () => this.doubleMoney());
    this.sortBtn.addEventListener('click', () => this.sortByRichest());
    this.showMillBtn.addEventListener('click', () => this.showMillionaires());
    this.calcWealthBtn.addEventListener('click', () => this.calculateWealth());
  }

  getInitialData() {
    for (let i = 0; i < 3; i++) {
      this.addUser();
    }
  }

  doubleMoney() {
    this.data = this.data.map(user => {
      return {
        ...user,
        money: user.money * 2
      };
    });

    this.updateDOM();
  }

  sortByRichest() {
    this.data = this.data.sort((a, b) => b.money - a.money);

    this.updateDOM();
  }

  calculateWealth() {
    const wealth = this.data.reduce((acc, user) => (acc += user.money), 0);

    let wealthElem = document.createElement('div');
    wealthElem.innerHTML = `<h3>Total Wealth: <strong>${this.formatMoney(
      wealth
    )}</strong></h3>`;
    this.mainElem.appendChild(wealthElem);
  }

  showMillionaires() {
    const ONE_MILLION = 1000000;

    this.data = this.data.filter(user => user.money > ONE_MILLION);
    this.updateDOM();
  }

  async addUser() {
    let randomUser = await this.getRandomUser();
    this.updateData(randomUser);
    this.updateDOM();
  }

  async getRandomUser() {
    let request = await fetch(this.apiUrl);
    let response = await request.json();
    let user = response.results[0];
    return new Promise(resolve =>
      resolve({
        name: `${user.name.first} ${user.name.last}`,
        money: Math.floor(Math.random() * 1000000)
      })
    );
  }

  updateData(newData) {
    this.data.push(newData);
  }

  updateDOM(providedData = this.data) {
    this.mainElem.innerHTML = '<h2><strong>Person</strong> Wealth</h2>';

    providedData.forEach(item => {
      let divElem = document.createElement('div');
      divElem.classList.add('person');
      divElem.innerHTML = `<strong>${item.name}</strong> ${this.formatMoney(
        item.money
      )}`;
      this.mainElem.appendChild(divElem);
    });
  }

  formatMoney(number) {
    return '€' + number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
})();
