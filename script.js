const data = JSON.parse(localStorage.getItem('moneyGame')) || {
    items: [],
    userNotes: ''
}

const items = data.items
let selectedItem = null

function updateDisplay() {
    let money = 0
    items.forEach(item => {
        money -= item.price
    })
    document.getElementById('money').innerText = `Money: ${money.toLocaleString()}`

    const itemTable = document.getElementById('itemTable')
    itemTable.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Info</th>
        </tr>
    `
    items.forEach(item => {
        const row = document.createElement('tr')
        const name = document.createElement('td')
        const price = document.createElement('td')
        const info = document.createElement('td')

        name.innerText = item.name
        price.innerText = item.price.toLocaleString()
        info.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>'

        row.appendChild(name)
        row.appendChild(price)
        row.appendChild(info)
        itemTable.appendChild(row)

        info.addEventListener('click', () => {
            selectedItem = item
            document.getElementById("itemOverview").style.display = 'flex'
            document.getElementById("overviewImg").src = item.img || 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='
        })
    })
}

function saveData() {
    data.items = items
    localStorage.setItem('moneyGame', JSON.stringify(data))
}

function closeOverview() {
    selectedItem = null
    document.getElementById("itemOverview").style.display = 'none'
}

function deleteItem() {
    items.splice(items.indexOf(selectedItem), 1)
    selectedItem = null
    document.getElementById("itemOverview").style.display = 'none'
    saveData()
    updateDisplay()
}

const userNotes = document.getElementById('userNotes')
userNotes.value = data.userNotes
userNotes.addEventListener('input', () => {
    data.userNotes = userNotes.value
    saveData()
})

document.getElementById("itemPurchaseButton").addEventListener('click', () => {
    const itemName = document.getElementById('itemName')
    const itemPrice = document.getElementById('itemPrice')
    const itemImg = document.getElementById('itemImg')

    if (!itemName.value || !itemPrice.value) {
        alert('Please fill item name and price')
        return
    }

    items.push({
        name: itemName.value,
        price: parseInt(itemPrice.value),
        img: itemImg.value || null
    })

    itemName.value = ''
    itemPrice.value = ''
    itemImg.value = ''

    saveData()
    updateDisplay()
})

document.getElementById("overviewCloseButton").addEventListener('click', closeOverview)
document.getElementById("overviewRemoveButton").addEventListener('click', deleteItem)

updateDisplay()