"use strict";
(function(){

    //region initial Data
    class User{
        constructor(firstName, lastName, email, userPhone, userBirthday){
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.phone = userPhone;
            this.birthday = userBirthday;
        }
    }

    let lotteryList = [],
        userToEdit, userEditElement,
        emailPattern= '^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}$',
        textPattern = '^[а-яА-ЯёЁa-zA-Z]+$';

    let userForm = document.getElementById('user-add-form'),
        userAddBtn = document.getElementById('add-user-btn'),
        addUser = document.getElementById('add-user'),
        firstName = document.getElementById('first-name'),
        lastName = document.getElementById('last-name'),
        userEmail = document.getElementById('email'),
        userPhone = document.getElementById('phone'),
        userBirthday = document.getElementById('birthday'),
        getWinnerBtn = document.getElementById('get-winner'),
        modal = document.getElementById('siteModal'),
        saveBtn = document.getElementById('save-user-btn'),
        closeBtn = document.getElementsByClassName('close')[0],
        lottery = document.getElementById('lottery-list');

    //endregion

    //region Events
    closeBtn.onclick = function (e) {
        modal.style.display = "none";
    };

    getWinnerBtn.onclick = function (e) {
        if (lotteryList.length) {
            getWinner();
        } else {
            alert('Please add any user');
        }

    };

    addUser.onclick = function (e) {
        userForm.reset();
        saveBtn.style.display = 'none';
        userAddBtn.style.display = 'inline-block';
        openForm();
    };

    lastName.addEventListener("keyup", function (e) {
        setTimeout(function () {
            if (!validateFields(e.target.value, textPattern)) {
                lastName.nextElementSibling.style.display = 'block';
            } else {
                lastName.nextElementSibling.style.display = 'none';
            }
        }, 2000);
    });

    firstName.addEventListener("keyup", function (e) {
        setTimeout(function () {
            if (!validateFields(e.target.value, textPattern)) {
                firstName.nextElementSibling.style.display = 'block';
            } else {
                firstName.nextElementSibling.style.display = 'none';
            }
        }, 2000);
    });

    userEmail.addEventListener("keyup", function (e) {
        setTimeout(function () {
            if (!validateFields(e.target.value, emailPattern)) {
                userEmail.nextElementSibling.style.display = 'block';

            } else {
                userEmail.nextElementSibling.style.display = 'none';
            }
        }, 2000);
    });

    saveBtn.onclick = function (e) {
        if (!isEmptyFields() &&
            (validateFields(userEmail.value, emailPattern) && validateFields(firstName.value, textPattern) && validateFields(lastName.value, textPattern))) {
            saveUser();
        } else {
            alert("Please enter required field")
        }
    };

    userAddBtn.onclick = function (e) {
        if (!isEmptyFields() &&
            (validateFields(userEmail.value, emailPattern) && validateFields(firstName.value, textPattern) && validateFields(lastName.value, textPattern))) {
            addToLotteryList(createUser());
        } else {
            alert("Please enter required field")
        }
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    //endregion

    //region functions
    function addToLotteryList(user) {
        if ((!findUser(user.email) && lotteryList.length) || !lotteryList.length) {
            lotteryList.push(user);
            let li = createUserItem();
            lottery.appendChild(li);
            modal.style.display = 'none';
            userForm.reset();
        } else {
            alert("Email already exist")
        }

    }

    function createUserItem() {
        let user = createUser();
        let li = document.createElement('li');
        li.appendChild(document.createTextNode(user.firstName + ' ' + user.lastName + ' ' + user.email));
        let edit = document.createElement('button');
        let removeUser = document.createElement('button');
        removeUser.appendChild(document.createTextNode(' remove'));
        edit.appendChild(document.createTextNode(' edit'));
        removeUser.classList.add('btn');
        removeUser.classList.add('btn-remove');
        edit.setAttribute('data-email', user.email);
        edit.classList.add('btn');
        removeUser.setAttribute('data-email', user.email);

        removeUser.onclick = function (e) {
            console.log(e);

            let index = findUser(e.target.getAttribute('data-email'));
            lotteryList.splice(index, 1);

            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        };

        edit.onclick = function (e) {
            editUser(lotteryList[findUser(e.target.getAttribute('data-email'))], e.target.parentNode);
        };

        li.appendChild(edit);
        li.appendChild(removeUser);
        return li;

    }

    function editUser(user, element) {
        userToEdit = user;
        userEditElement = element;
        firstName.value = user.firstName;
        lastName.value = user.lastName;
        userEmail.value = user.email;
        if (user.phone) userPhone.value = user.phone;
        if (user.birthday) userBirthday.value = user.birthday;
        saveBtn.style.display = 'inline-block';
        userAddBtn.style.display = 'none';
        openForm();
    }

    function getWinner() {
        let winner = lotteryList[Math.floor(Math.random() * lotteryList.length)];
        alert(winner.firstName  + ' ' + winner.lastName + ' is winner. ' + winner.email);
    }

    function openForm(){
        userForm.style.display = "block";
        modal.style.display = "block";
    }

    function saveUser() {
        let index = findUser(userToEdit.email);
        let newUser = createUserItem();
        lotteryList[index] = newUser;
        lottery.replaceChild(newUser, userEditElement);
        modal.style.display = "none";
    }

    function createUser() {
        let user = new User(firstName.value, lastName.value, userEmail.value);
        if (userPhone.value) user.phone = userPhone.value;
        if (userBirthday.value) user.birthday = userBirthday.value;
        return user;
    }

    function findUser(email) {
        for (let i=0; i < lotteryList.length; i++){
            if (lotteryList[i]['email'] === email){
                return i;
            }
        }
    }

    function isEmptyFields(){
        if (!userEmail.value && !firstName.value && !lastName.value) return true;
        return false;
    }

    function validateFields(value, pattern) {
        if (value.match(pattern)) {
            return true;
        } else {
            return false;
        }
    }
    //endregion

})();
