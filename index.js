const wrapper = document.querySelector('.wrapper')
const input = document.querySelector('input')
const search = document.querySelector('.search')
const showBlock = document.querySelector('.showBlock')
const list = document.createElement('ul')
const wrapp = document.querySelector('.wrapp')

const resultSearch = []

function getRepos(keywords, cb) {
    if(keywords.length > 0) {
        fetch(`https://api.github.com/search/repositories?q=${keywords}`)
            .then(response => response.json())
            .then(data => data.items.map(item => ({
                "name": item.name,
                "stars": item.stargazers_count,
                "owner": item.name,
                "fullname": item.full_name
            })))
            .then(response => cb(response))
            .catch(error => console.log(error))
    } else {
        Array.from(list.children).forEach((li) => li.remove())
    }
}


const debounce = (fn, ms) => {
    let timeout
    return function() {
        const fnCall = () => {
            fn.apply(this, arguments)
        }
        clearTimeout(timeout)
        timeout = setTimeout(fnCall, ms)
    }
}


function renderResultSearch(response) {
    Array.from(list.children).forEach((li) => li.remove())
    for (let i = 0; i < 5; i++) {
        const repos = response[i]
        resultSearch.push(response[i])
        const listItem = myCreateElement('li', 'item')
        list.className = 'searchItem'
        listItem.textContent = repos.fullname
        list.appendChild(listItem)
    }
    showBlock.appendChild(list)
}

function createInfoBlock(obj) {
    const block = myCreateElement('div', 'infoBlock')
    const ul = myCreateElement('ul', 'infoBlock_infoItems')
    const name = myCreateElement('li', 'infoItems_item')
    const owner = myCreateElement('li', 'infoItems_item')
    const stars = myCreateElement('li', 'infoItems_item')
    name.textContent = `Name: ${obj.name}`
    owner.textContent = `Owner: ${obj.owner}`
    stars.textContent = `Stars: ${obj.stars}`
    const close = myCreateElement('img', 'closeModal')
    close.src = 'close.svg'
    ul.appendChild(name)
    ul.appendChild(owner)
    ul.appendChild(stars)
    block.appendChild(ul)
    block.appendChild(close)
    block.classList.remove('infoBlockHidden')
    wrapp.appendChild(block)
}


function myCreateElement(element, className) {
    const res = document.createElement(element)
    if (className) { 
        res.className = className
    }
    return res
}


function inputKeyword(e) {
    let val = e.target.value
    getRepos(val, renderResultSearch)
}


inputKeyword = debounce(inputKeyword, 400)

input.addEventListener('input', inputKeyword)

list.addEventListener('click', function(e) {
    console.log(e)
    const obj = resultSearch.filter((item) => item.fullname === e.target.textContent)
    createInfoBlock(...obj)
    e.target.parentNode.remove()
    input.value = ''
})


wrapp.addEventListener('click', function(e) {
    e.target.parentNode.remove()
})



