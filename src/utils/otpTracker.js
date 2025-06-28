
let users = []


function addUser(data) {
    users.push(data)
}

function resetUser(email) {
    users = users.filter((item) => item.email !== email)
}

function getUser(otp) {
    console.log('otp', otp)
    let user = users.filter(item => {
        console.log('item', item)
        return item.otp === parseInt(otp)
    })
    console.log('user', user)
    if (user.length !== 0) {
        return { status: true, user: user[0] }
    }
    else {
        return { status: false }
    }

}

module.exports = {
    addUser,
    resetUser,
    getUser,
    users
}