const data = JSON.parse(localStorage.getItem('moneyGame')) || {
    items: [],
    userNotes: '',
    payout: 1500,
    day: 1,
    lastOnline: Date.now(),
    lastPayout: 0
}

const items = data.items
let selectedItem = null

if (!data.userNotes) {
    data.userNotes = ''
    saveData()
}

if (!data.payout) {
    data.payout = 1500
    saveData()
}

if (!data.day) {
    data.day = 1
    saveData()
}

if (!data.lastOnline) {
    data.lastOnline = Date.now().setHours(0)
    saveData()
}

if (!data.items) {
    data.items = []
    saveData()
}

if (!data.lastPayout) {
    data.lastPayout = 0
    saveData()
}

function updateDay() {
    const now = new Date()
    now.setHours(0)
    data.lastOnline = new Date(data.lastOnline).setHours(0)
    if (now - data.lastOnline >= 24 * 60 * 60 * 1000) {
        data.day += 1
        data.lastOnline = now
        saveData()
    }

    if (data.day - data.lastPayout >= 7) {
        data.lastPayout = data.day
        let payout = data.payout
        items.forEach(item => {
            if (item.price > 0) {
                payout += item.price/100*5
            }
        })
        payout = Math.floor(payout)
        items.push({
            name: 'Payout',
            price: -payout,
            img: null
        })
        saveData()
        popup("Payout day!")
    }

    document.getElementById('day').innerText = `Day: ${data.day}`
}

function updateDisplay() {
    let money = 0
    items.forEach(item => {
        money -= item.price
    })
    document.getElementById('money').innerText = `Money: ${money.toLocaleString()}`

    const itemTable = document.getElementById('itemTable')
    itemTable.innerHTML = `
        <tr>
            <th>Day</th>
            <th>Name</th>
            <th>Price</th>
            <th>Info</th>
        </tr>
    `
    items.forEach(item => {
        const row = document.createElement('tr')
        const day = document.createElement('td')
        const name = document.createElement('td')
        const price = document.createElement('td')
        const info = document.createElement('td')

        day.innerText = item.day || 1
        name.innerText = item.name
        price.innerText = item.price.toLocaleString()
        info.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>'

        row.appendChild(day)
        row.appendChild(name)
        row.appendChild(price)
        row.appendChild(info)
        itemTable.insertBefore(row, itemTable.rows[1])

        info.addEventListener('click', () => {
            selectedItem = item
            document.getElementById("itemOverview").style.display = 'flex'
            document.getElementById("overviewImg").src = item.img || 'https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='
            document.getElementById("overviewUrl").href = item.url.startsWith('http') ? item.url : 'https://' + item.url || ''
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

function popup(text) {
    document.querySelector('.itemPurchased').innerText = text
    document.querySelector('.itemPurchased').style.display = 'flex'
    setTimeout(() => {
        document.querySelector('.itemPurchased').style.display = 'none'
    }, 2000)
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
    const itemUrl = document.getElementById('itemUrl')

    if (!itemName.value || !itemPrice.value) {
        alert('Please fill item name and price')
        return
    }

    items.push({
        name: itemName.value,
        price: parseInt(itemPrice.value),
        img: itemImg.value || null,
        url: itemUrl.value || null,
        day: data.day
    })

    itemName.value = ''
    itemPrice.value = ''
    itemImg.value = ''
    itemUrl.value = ''

    popup("Item Purchased!")

    saveData()
    updateDisplay()
})

const payoutInput = document.getElementById("payout")
payoutInput.value = data.payout
payoutInput.addEventListener('change', () => {
    if (!payoutInput.value) {
        payoutInput.value = 1500
        return
    }
    data.payout = parseInt(payoutInput.value)
})

document.getElementById("overviewCloseButton").addEventListener('click', closeOverview)
document.getElementById("overviewRemoveButton").addEventListener('click', deleteItem)

document.getElementById("reset").addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all data?')) {
        localStorage.removeItem('moneyGame')
        location.reload()
    }
})

updateDisplay()
updateDay()