class Users {
    constructor(gameState) {
        this.users = [];
        this.gameState = gameState;
        this.usersBox = this.createUsersBox();
        this.gameState.gameBoard.appendChild(this.usersBox);
    }
    createUsersBox() {
        const userBox = document.createElement('div');
        userBox.classList.add('users-wrapper');
        return userBox;
    }
    createUserObj(user) {
        const userObj = document.createElement('div');
        const userInfo = document.createElement('p');
        userObj.setAttribute("data-current", "false");
        userInfo.innerText = `${user.username}`;
        userObj.appendChild(userInfo);
        return userObj;
    }
    addUser(user) {
        const userIndex = this.users.findIndex((item) => item.id == user.id);
        if (userIndex !== -1) {
            console.log('User already exists');
            return;
        }
        const userObj = this.createUserObj(user);
        const userToAdd = Object.assign(Object.assign({}, user), { element: userObj });
        this.users.push(userToAdd);
        this.usersBox.appendChild(userObj);
    }
    addUsers(users) {
        users.forEach((user) => {
            this.addUser(user);
        });
    }
    setTurn(uid, color) {
        let modIndex = -1;
        this.users.forEach((user, index) => {
            if (user.id == uid) {
                modIndex = index;
            }
            user.element.setAttribute("data-current", "false");
        });
        if (modIndex === -1) {
            alert("Error current user not found");
        }
        this.users[modIndex].element.setAttribute("data-current", "true");
        if (color) {
            this.users[modIndex].element.setAttribute("data-current-color", color);
        }
    }
}
export { Users };
//# sourceMappingURL=Users.js.map