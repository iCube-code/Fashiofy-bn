
let users = []


function addUser(data) {
    // check if the user is already exists
    let user = users.filter(item => item.email === data.email)
    // update user with new data
    if (user.length !== 0) {
        users = users.map((item) => {
            if (item.email === data.email) {
                return data
            }
            else {
                return item
            }
        })
    }
    else {
        // if not exists just add it
        users.push(data)
    }

}

function resetUser(email) {
    users = users.filter((item) => item.email !== email)
}

function getUser(otp) {
    let user = users.filter(item => {
        return item.otp === parseInt(otp)
    })
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
    getUser
}