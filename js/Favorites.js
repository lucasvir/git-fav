import { GithubUser } from './GithubUser.js';

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = document.querySelector('table tbody');
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
    this.itsBlank();
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExist = this.entries.find((entry) => entry.login == username);
      if (userExist) {
        throw new Error('Usuário já adicionado');
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado');
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.needScrollBar();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredUsers = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredUsers;
    this.save();
    this.update();
    this.itsBlank();
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.addingFavorite();
    this.update();
    this.itsBlank();
  }

  addingFavorite() {
    const addButton = document.querySelector('#button-add');
    addButton.onclick = () => {
      const { value } = document.querySelector('#input-search');
      this.add(value);
    };
  }

  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector(
        '.user-img'
      ).src = `http://github.com/${user.login}.png`;
      row.querySelector('.user-link').href = `http://github.com/${user.login}`;
      row.querySelector('.user-img').alt = `Imagem do usuario ${user.name}`;
      row.querySelector('.user-name').textContent = `${user.name}`;
      row.querySelector('.user-login').textContent = `/${user.login}`;
      row.querySelector('.td-repos').textContent = `${user.public_repos}`;
      row.querySelector('.td-followers').textContent = `${user.followers}`;

      row.querySelector('.td-actions').onclick = () => {
        const isOk = confirm('Tem certeza que deseja remover esse usuário?');

        if (isOk) {
          this.delete(user);
        }
      };
      this.tbody.append(row);
    });

    this.needScrollBar();
    this.save();
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove();
    });
  }

  createRow() {
    const tr = document.createElement('tr');
    tr.innerHTML = `
            <td class="td-user">
              <img class="user-img" src='' alt="" />
              <a class="user-link" target="_blank">
                <p class="user-name"></p>
                <span class="user-login"></span>
              </a>
            </td>
            <td class="td-repos"></td>
            <td class="td-followers"></td>
            <td class="td-actions"><span>Remove</span></td>
    `;

    return tr;
  }

  noFavoritesPage() {
    const blankTr = document.createElement('tr');
    blankTr.innerHTML = `
        <td class="td-no-page" colspan="4">
          <img class="no-favorites" src="./assets/icons/star-2.svg" alt=""/>
          <p class="no-favorites-text">Nenhum favorito ainda</p>
        </td>
          `;

    return blankTr;
  }

  itsBlank() {
    if (this.entries.length === 0) {
      const noFavPage = this.noFavoritesPage();
      this.tbody.append(noFavPage);
    }
  }

  needScrollBar() {
    const hasScrollBar = this.tbody.childNodes.length >= 5;

    if (hasScrollBar) {
      this.root.classList.add('scroll-table');
    } else {
      this.root.classList.remove('scroll-table');
    }
  }
}
