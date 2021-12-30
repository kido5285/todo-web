function without(a){return this!=a;}

// function addItem(descrip){
//     let active = JSON.parse(localStorage.getItem('active'));
//     let completed = JSON.parse(localStorage.getItem('completed'));
//     active.push(descrip);
//     localStorage.setItem('active', JSON.stringify(active))
//     localStorage.setItem('completed', JSON.stringify(completed))
//     return;
// }

// function removeItem(descrip, status){
//     let active = JSON.parse(localStorage.getItem('active'));
//     let completed = JSON.parse(localStorage.getItem('completed'));
//     if(status === 'active'){
//         active = active.filter(without, descrip);
//         localStorage.setItem('active', JSON.stringify(active))
//         localStorage.setItem('completed', JSON.stringify(completed))
//         return;
//     } else if(status === 'completed'){
//         completed = completed.filter(without, descrip);
//         localStorage.setItem('active', JSON.stringify(active))
//         localStorage.setItem('completed', JSON.stringify(completed))
//         return;
//     }
// }

// function completeItem(descrip){
//     let active = JSON.parse(localStorage.getItem('active'));
//     let completed = JSON.parse(localStorage.getItem('completed'));
//     active = active.filter(without, descrip);
//     completed.push(descrip);
//     localStorage.setItem('active', JSON.stringify(active))
//     localStorage.setItem('completed', JSON.stringify(completed))
//     return;
// }

// function uncompleteItem(descrip){
//     let active = JSON.parse(localStorage.getItem('active'));
//     let completed = JSON.parse(localStorage.getItem('completed'));
//     completed = completed.filter(without, descrip);
//     active.push(descrip);
//     localStorage.setItem('active', JSON.stringify(active))
//     localStorage.setItem('completed', JSON.stringify(completed))
//     return;
// }

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

document.querySelector('.additem_form').onsubmit = (e) => {
    e.preventDefault();
    let input = e.target.querySelector('input[type="text"]').value;
    let list = document.querySelector('.list');
    if(list.innerHTML === '<p>No todos:(</p>'){
        list.innerHTML = '';
    }
    e.target.querySelector('input[type="text"]').value = '';
    list.innerHTML += `
<li class="item">
    <span class="title">${input}</span>
    <div>
        <input type="checkbox" onchange="checkelem(event)" class="checkbox">
        <div class="sym" onclick="crosselem(event)">&times;</div>
    </div>
</li>
`;
    let resObj = {
        'descrip': input
    }
    $.ajax({
        type: 'post',
        url: '/user/additem',
        data: $.param(resObj),
        success: (res) => console.log(res),
        error: (res) => console.log(res)
    }); 
}


//submit form
function signup(e) {
    e.preventDefault();
    let form =  $('form[name="signup_form"]');
    console.log(form.serialize())
    $.ajax({
        type: 'POST',
        url: '/user/submitsignup/',
        data: form.serialize(),
        success: (res) => {
            console.log(res)
            let html = `<div class="suc-mes">signup successful, you may now login</div>`
            form.prepend(html)
        },
        error : (xhr, stat, error) => {
            console.log(error)
            let html = `<div class="err-mes">Signup unsuccessful</div>`
            form.prepend(html)
        }
    })
}

function login(e) {
    e.preventDefault();
    let form = $('form[name="login_form"]');
    $.ajax({
        type: 'POST',
        url: '/user/submitlogin/',
        data: form.serialize(),
        success: (res) => {
            window.location.href = '/dashboard'
        },
        error : (xhr, stat, error) => {
            console.log(error)
            let html = `<div class="err-mes">Login credentials incorrect</div>`
            form.prepend(html)
        }
    })
}

function logout(e) {
    $.ajax({
        type: 'POST',
        url: '/user/signout',
        data: JSON.stringify({}),
        success: (e) => {
            window.location.href = '/';
        }
    })
}