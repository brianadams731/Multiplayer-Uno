import { IGameState } from './interfaces/IGameState';

interface IUser {
    username: string;
    id: string;
}

interface UserElement extends IUser{
    element: HTMLDivElement;
}

class Users {
    private users: UserElement[];
    private usersBox: HTMLDivElement;
    private gameState: IGameState;
    constructor(gameState: IGameState) {
        this.users = [];
        this.gameState = gameState;

        this.usersBox = this.createUsersBox();
        this.gameState.gameBoard.appendChild(this.usersBox);
    }

    private createUsersBox(): HTMLDivElement {
        const userBox = document.createElement('div');
        userBox.classList.add('users-wrapper');
        return userBox;
    }

    private createUserObj(user: IUser): HTMLDivElement {
        const userObj = document.createElement('div');
        const userInfo = document.createElement('p');
        userObj.setAttribute("data-current","false");
        userInfo.innerText = `${user.username}`;
        userObj.appendChild(userInfo);
        return userObj;
    }

    public addUser(user: IUser) {
        const userIndex = this.users.findIndex((item) => item.id == user.id);
        if (userIndex !== -1) {
            console.log('User already exists');
            return;
        }

        const userObj = this.createUserObj(user);
        const userToAdd = {
            ...user,
            element: userObj
        }
        this.users.push(userToAdd);
        this.usersBox.appendChild(userObj);
    }

    public addUsers(users: IUser[]) {
        users.forEach((user) => {
            this.addUser(user);
        });
    }

    public setTurn(uid: string | number, color?: string):void {
        let modIndex = -1;
        this.users.forEach((user, index) =>{
            if(user.id == uid){
                modIndex = index;
            }
            user.element.setAttribute("data-current","false");
        })

        if(modIndex === -1){
            alert("Error current user not found");
        }
                
        this.users[modIndex].element.setAttribute("data-current","true");
        if(color){
            this.users[modIndex].element.setAttribute("data-current-color", color);
        }
    }
}

export { Users };
