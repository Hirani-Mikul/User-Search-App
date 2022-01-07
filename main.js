const users_list = document.getElementById('users_list');
const profile_info = document.getElementById('profile_info');
const page_list = document.getElementById('page_list');
const form = document.getElementById('form');

let MAX_RECORDS = 50;

let Users = [];
let currentPage = 1;
let prevPageElm = null;
let total_pages = 0;


let currentRecord = { start: 0, end: MAX_RECORDS};

const start = () => {

  setLoaderOn(users_list);
  setLoaderOn(profile_info);
  axios.get('./Users.json').then(res => {
    total_pages = Math.floor(res.data.length / MAX_RECORDS);
    Users = res.data.slice(currentRecord.start, currentRecord.end);
    
    updateUsersList();
    getPageHTML();

  })

}

function setLoaderOn(elm)
{
  elm.innerHTML = getLoader();
  elm.classList.add('center');
}
function setLoaderOff(elm)
{
  elm.innerHTML = '';
  elm.classList.remove('center');
}

const update = () => {

  setLoaderOn(users_list);
  axios.get('./Users.json').then(res => {
    Users = [];

    Users = res.data.slice(currentRecord.start, currentRecord.end);
    
    profile_info.innerHTML = getUserProfile(null);
    updateUsersList();
  })

}


start();

function updateUsersList()
{
  setLoaderOff(users_list);

  profile_info.innerHTML = getUserProfile(null);

  if (Users.length == 0)
  {
    let elm = document.createElement('div');
    elm.innerHTML = 'NO USERS FOUND';
    elm.style = 'font-size: 5rem; text-align: center;';
    users_list.appendChild(elm);
    return;
  }
    users_list.innerHTML = Users.map(user => getUserTile(user)).join('');
}

function getLoader() {
  return `<div class="loader">
  <div class="ring"></div>
  <span>Loading...</span>
</div>`;
}

function getUserProfile(user)
{
  setLoaderOff(profile_info);
    if (user == null) return `<h1 style="font-size: 3rem; margin: auto;">?</h1>`;

    return `
    <div class="profile">
    <div class="img-overlay">
      <img src="https://random.imagecdn.app/500/150" alt="${user.first_name}" />
    </div>
    <h1>${user.first_name} ${user.last_name}</h1>
  </div>
  <div class="profile-details">
    <h3><span>Email: </span><span>${user.email}</span></h3>
    <h3><span>Phone: </span><span>+2523323232</span></h3>
    <h3><span>Gender: </span><span>${user.gender}</span></h3>
  </div>
    `;
}

function getUserTile(user)
{
    return `
    <li data-id="${user.id}" onclick="handleClick(event)">
          <div class="img-overlay">
            <img src="https://random.imagecdn.app/500/150" alt="${user.first_name}" />
          </div>
          <h4>${user.first_name} ${user.last_name}</h4>
          <span>&nbsp;|&nbsp;${user.email}</span>
        </li>
    `;
}

function handleClick(e)
{
  setLoaderOn(profile_info);
    let user = Users.find((u) => {
        return u.id == e.target.dataset['id'];
    })

    profile_info.innerHTML = getUserProfile(user);
}


function getPageHTML()
{
  let HTML = '';
  for (let i = 1; i <= total_pages; i++)
  {
    HTML += `<li onclick="handleChangePage(event)">${i}</li>`;
  }

  page_list.innerHTML = HTML;
  page_list.firstChild.classList.add('highlight');
  prevPageElm = page_list.firstChild;

}

function handleChangePage(e)
{
  if (prevPageElm != null)
  {
    prevPageElm.classList.remove('highlight');
  }
  e.target.classList.add('highlight');
  prevPageElm = e.target;
  currentPage = e.target.innerHTML;
  currentRecord.start = Math.abs((currentPage - 1) * MAX_RECORDS);
  currentRecord.end = currentRecord.start + MAX_RECORDS; 
  update();

}

function getUsersByName(name)
{
    axios.get('./Users.json').then(res => {
      setLoaderOn(users_list);

        Users = res.data.filter(u => {
          return u.first_name.toLocaleLowerCase() == name || u.last_name.toLocaleLowerCase() == name || (u.first_name + ' ' + u.last_name) == name; 
        });
      
      }).then(res => {
          updateUsersList();
    })

}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  let input = e.target['name'].value.toLocaleLowerCase();
  if (input.trim().length == 0)
  {
    return;
  }
  e.target['name'].value = '';
  getUsersByName(input);

})

