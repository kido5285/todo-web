function without(a){return this!=a;}

function addItem(descrip){
    let active = JSON.parse(localStorage.getItem('active'));
    let completed = JSON.parse(localStorage.getItem('completed'));
    active.push(descrip);
    localStorage.setItem('active', JSON.stringify(active))
    localStorage.setItem('completed', JSON.stringify(completed))
    return;
}

function removeItem(descrip, status){
    let active = JSON.parse(localStorage.getItem('active'));
    let completed = JSON.parse(localStorage.getItem('completed'));
    if(status === 'active'){
        active = active.filter(without, descrip);
        localStorage.setItem('active', JSON.stringify(active))
        localStorage.setItem('completed', JSON.stringify(completed))
        return;
    } else if(status === 'completed'){
        completed = completed.filter(without, descrip);
        localStorage.setItem('active', JSON.stringify(active))
        localStorage.setItem('completed', JSON.stringify(completed))
        return;
    }
}

function completeItem(descrip){
    let active = JSON.parse(localStorage.getItem('active'));
    let completed = JSON.parse(localStorage.getItem('completed'));
    active = active.filter(without, descrip);
    completed.push(descrip);
    localStorage.setItem('active', JSON.stringify(active))
    localStorage.setItem('completed', JSON.stringify(completed))
    return;
}

function uncompleteItem(descrip){
    let active = JSON.parse(localStorage.getItem('active'));
    let completed = JSON.parse(localStorage.getItem('completed'));
    completed = completed.filter(without, descrip);
    active.push(descrip);
    localStorage.setItem('active', JSON.stringify(active))
    localStorage.setItem('completed', JSON.stringify(completed))
    return;
}

window.onload = (e) => {
    if(!localStorage.getItem('active') || !localStorage.getItem('completed')){
        localStorage.setItem('active', JSON.stringify([]))
        localStorage.setItem('completed', JSON.stringify([]))
    }
    let active = JSON.parse(localStorage.getItem('active'));
    let completed = JSON.parse(localStorage.getItem('completed'));
    let list = document.querySelector('.list')
    if(active.length === 0 && completed.length === 0){
        return list.innerHTML = '<p>No todos:(</p>'
    }
    active.forEach(elem => {
        let html = `
<li class="item">
    <span class="title">${elem}</span>
    <div>
        <input type="checkbox" class="checkbox real">
        <div class="sym">&times;</div>
    </div>
</li>
`
        list.innerHTML += html
    })
    completed.forEach(elem => {
        let html = `
<li class="item completed">
    <span class="title">${elem}</span>
    <div>
        <input type="checkbox" class="checkbox real" checked>
        <div class="sym">&times;</div>
    </div>
</li>
`
        list.innerHTML += html
    })
}

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

waitForElm('.real').then((elm) => {
    [...document.querySelectorAll('.checkbox')].forEach(elem => {
        elem.onchange = (e) => {
            let parent = e.target.parentElement.parentElement;
            let text = parent.querySelector('.title').textContent;
            if(parent.classList.contains('completed')){
                //add item
                uncompleteItem(text);
                parent.classList.remove('completed');
            } else {
                //remove item
                completeItem(text);
                parent.classList.add('completed');
            }
        }
    });
    [...document.querySelectorAll('.sym')].forEach(elem => {
       elem.onclick = (e) => {
           let parent = e.target.parentElement.parentElement;
           let text = parent.querySelector('.title').textContent;
           let list = document.querySelector('.list');
           if(parent.classList.contains('completed')){
                removeItem(text, 'completed');
                parent.style.display = 'none';
                let active = JSON.parse(localStorage.getItem('active'));
                let completed = JSON.parse(localStorage.getItem('completed'));
                if(active.length === 0 && completed.length === 0){
                    list.innerHTML = '<p>No todos:(</p>'   
                }
           } else {
                removeItem(text, 'active');
                parent.style.display = 'none';
                let active = JSON.parse(localStorage.getItem('active'));
                let completed = JSON.parse(localStorage.getItem('completed'));
                if(active.length === 0 && completed.length === 0){
                    list.innerHTML = '<p>No todos:(</p>'   
                }
           }
       } 
    })
});

document.querySelector('.additem_form').onsubmit = (e) => {
    e.preventDefault();
    let input = e.target.querySelector('input[type="text"]').value;
    let list = document.querySelector('.list');
    if(list.innerHTML === '<p>No todos:(</p>'){
        list.innerHTML = '';
    }
    e.target.querySelector('input[type="text"]').value = '';
    addItem(input);
    list.innerHTML += `
<li class="item">
    <span class="title">${input}</span>
    <div>
        <input type="checkbox" class="checkbox real">
        <div class="sym">&times;</div>
    </div>
</li>
`;
    [...document.querySelectorAll('.checkbox')].forEach(elem => {
        elem.onchange = (e) => {
            let parent = e.target.parentElement.parentElement;
            let text = parent.querySelector('.title').textContent;
            if(parent.classList.contains('completed')){
                //add item
                uncompleteItem(text);
                parent.classList.remove('completed');
            } else {
                //remove item
                completeItem(text);
                parent.classList.add('completed');
            }
        }
    });
    [...document.querySelectorAll('.sym')].forEach(elem => {
    elem.onclick = (e) => {
        let parent = e.target.parentElement.parentElement;
        let text = parent.querySelector('.title').textContent;
        if(parent.classList.contains('completed')){
                removeItem(text, 'completed');
                parent.style.display = 'none';
        } else {
                removeItem(text, 'active');
                parent.style.display = 'none';
        }
    } 
    })
}