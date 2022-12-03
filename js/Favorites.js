import { GithubUser } from "./GithubUser.js"

class Favorites {
    constructor(root){
        this.root = document.querySelector(root)

        this.load()
    }

    save(){
        localStorage.setItem('@github-favorites:' , JSON.stringify(this.entries))
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    delete(user){
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        const entriesDeleteLength = this.entries.length
        this.noFav(entriesDeleteLength)

        this.update()
        this.save()
    }

    async searchUser(username){
        try{
            const userExist = this.entries.find(entry => entry.login === username)

            if(userExist){
                throw Error('Usuário já existe!')
            }
            const user = await GithubUser.search(username)

            if(user.login === undefined){
                throw Error('Usuário não existe!')
            }

            this.entries = [user , ...this.entries]
            const entriesLength = this.entries.length
            this.noFav(entriesLength)
            this.update()
            this.save()
        } catch(error){
            alert(error.message)
        }

    }

}

export class FavoritesView extends Favorites {
    constructor(root){
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    noFav(length){
        const noFavWrapper = document.querySelector('.nofav-wrapper')
        const hideCondition = length > 0

        if(hideCondition){
            noFavWrapper.classList.add('hide')
        } else {
            noFavWrapper.classList.remove('hide')
        }
    }

    onadd(){
        const buttonAdd = this.root.querySelector('.search button')
        buttonAdd.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.searchUser(value)
        }
    }

    update(){
        this.removeAlltr()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.profile img').src = `https://github.com/${user.login}.png`
            row.querySelector('.profile img').alt = `Imagem de ${user.name}`
            row.querySelector('.profile p').textContent = user.name
            row.querySelector('.profile span').textContent = user.login
            row.querySelector('.repos').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.btn-remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja remover esse usuário ?')

                if(isOk){
                    this.delete(user)
                }
            }

            this.tbody.append(row)

        })
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML =  `
                <td class="profile">
                    <img src="https://github.com/ymillerr.png" alt="foto de Vitor Eduardo">
                    <a href="https://github.com/ymillerr">
                        <p>Vitor Eduardo</p>
                        <span>/ymillerr</span>
                    </a>
                </td>
                <td class="repos">
                    123
                </td>
                <td class="followers">
                    12000
                </td>
                <td class="btn-remove">
                    <button>Remover</button>
                </td>
        `

        return tr
    }

    removeAlltr(){
        this.tbody.querySelectorAll('tr').forEach(tr =>{
            tr.remove()
        })
    }
}