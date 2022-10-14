import { GithubUser } from './GithubUser.js';

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.tbody = document.querySelector('table tbody');

    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.update();
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
            <td class="td-actions">Remove</td>
    `;

    return tr;
  }
}
