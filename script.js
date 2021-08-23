const taskContainer = document.querySelector(".Task__container");
const taskModal = document.querySelector(".task__modal__body");

let globalTaskData =[];
const genrateHTML = (taskData) =>`<div id=${taskData.id} class="col-md-6 col-lg-4 my-4">
<div class="card ">
    <div class="card-header d-flex justify-content-end gap-2">
      <button class="btn btn-outline-info" name=${taskData.id} onclick="editCard.apply(this , arguments)"><i class="fal fa-pencil-alt" name=${taskData.id}></i></button>
      <button class="btn btn-outline-danger" name=${taskData.id} onclick="deleteCard.apply(this , arguments)"><i class="fal fa-trash-alt" name=${taskData.id}></i></button>
    </div>
    <div class="card-body">
        <img src=${taskData.image} alt="image"
        class="card-img">
      <h5 class="card-title mt-4">${taskData.title}</h5>
      <p class="card-text">${taskData.description}</p>
      <span class="badge bg-primary">${taskData.type}</span>
      
    </div>
    <div class="card-footer ">
     <button class="btn btn-outline-primary" data-bs-toggle="modal"
     data-bs-target="#showTask"
     onclick="openTask.apply(this, arguments)" name=${taskData.id}>Open Task</button>
    </div>
  </div>
</div>`;

const insertToDOM = (content) =>taskContainer.insertAdjacentHTML("beforeend",content )

const saveToLocalStorage =() => localStorage.setItem("taskyCA",JSON.stringify({cards: globalTaskData}));


const addNewCard = () => {
    
    // get task data
    const taskData ={
        id:`${Date.now()}`,//templete literals
        title:document.getElementById("taskTitle").value,
        image:document.getElementById("imageURL").value,
        type:document.getElementById("taskType").value,
        description:document.getElementById("taskDescription").value
        
    };
    globalTaskData.push(taskData);
      //update the localstorage
      saveToLocalStorage();


       //generate HTML code
       const newCard =genrateHTML(taskData)
   
       // Inject to DOM
        insertToDOM(newCard)
       // clear the form

       document.getElementById("taskTitle").value="";
       document.getElementById("imageURL").value="";
       document.getElementById("taskType").value="";
       document.getElementById("taskDescription").value="";
       return;
};
const htmlModalContent = ( {id, image, title, description} ) => {
  
  const date = new Date(parseInt(id));
  return ` <div id=${id}>
  <img
  src=${
    image ||
    `https://images.unsplash.com/photo-1572214350916-571eac7bfced?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=755&q=80`
  }
  }
  alt="bg image"
  class="img-fluid place__holder__image mb-3"
  />
  <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
  <h2 class="my-3">${title}</h2>
  <p class="lead">
  ${description}
  </p></div>`
};

const loadExistingCards = () =>{
  
  //chek localstorage
const getData = localStorage.getItem("taskyCA")

  //retrive data, if exist
if(!getData) return;

const taskCards = JSON.parse(getData);
globalTaskData=taskCards.cards;

globalTaskData.map((taskData) =>{
  // generate HTML code for those Data
  const newCard =genrateHTML(taskData)


  //inject to the DOM
  insertToDOM(newCard)
})
  
   return;

}

const openTask = (e) => {
  const targetID=e.target.getAttribute("name")
  if (!e) e = window.event;

  const getTask = globalTaskData.filter(( id ) => id.id === targetID);
  
  taskModal.innerHTML = htmlModalContent(getTask[0]);
};

const deleteCard = (event) =>{
  const targetID=event.target.getAttribute("name")
const elementType=event.target.tagName;

const removeTask=globalTaskData.filter((task) => task.id !== targetID)
globalTaskData=removeTask
//update the localstorage
saveToLocalStorage();

if (elementType === "BUTTON"){
  return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode)
}
else{
  return taskContainer.removeChild(event.target.parentNode.parentNode.parentNode.parentNode)
}
}


const editCard = (event) =>{
const elementType=event.target.tagName;
let taskTitle;
let taskType;
let taskDescription;
let parentElement;
let submitButton;


if (elementType === "BUTTON"){
  parentElement=event.target.parentNode.parentNode
  
}
else{
  parentElement=event.target.parentNode.parentNode.parentNode
  
}
taskTitle =parentElement.childNodes[3].childNodes[3]
taskDescription =parentElement.childNodes[3].childNodes[5]
taskType =parentElement.childNodes[3].childNodes[7]
submitButton=parentElement.childNodes[5].childNodes[1]

taskTitle.setAttribute("contenteditable","true")
taskDescription.setAttribute("contenteditable","true")
taskType.setAttribute("contenteditable","true")
submitButton.removeAttribute("data-bs-toggle");
submitButton.removeAttribute("data-bs-target");
submitButton.innerHTML="Save Changes"
submitButton.setAttribute("onclick","saveEdit.apply(this , arguments)")


}

const  saveEdit = (event) =>{
 
  const targetID=event.target.getAttribute("name")
  
  const elementType=event.target.tagName;

  let parentElement;


if (elementType === "BUTTON"){
  parentElement=event.target.parentNode.parentNode
  
}
else{
  parentElement=event.target.parentNode.parentNode.parentNode
  
}
  const taskTitle =parentElement.childNodes[3].childNodes[3]
  const taskDescription =parentElement.childNodes[3].childNodes[5]
  const taskType =parentElement.childNodes[3].childNodes[7]
  const submitButton=parentElement.childNodes[5].childNodes[1]
  const upadteData ={
    title:taskTitle.innerHTML,
    type:taskType.innerHTML,
    description:taskDescription.innerHTML
  }
  const updateGlobalTasks=globalTaskData.map((task)=>{
    if (task.id === targetID){
      return {...task, ...upadteData}
    } 
     return task
  })
  globalTaskData=updateGlobalTasks

  saveToLocalStorage()
  taskTitle.setAttribute("contenteditable","false")
taskDescription.setAttribute("contenteditable","false")
taskType.setAttribute("contenteditable","false")
submitButton.setAttribute("onclick", "openTask.apply(this, arguments)");
submitButton.setAttribute("data-bs-toggle", "modal");
submitButton.setAttribute("data-bs-target", "#showTask");
submitButton.innerHTML="Open Task"
}

const searchTask = (e) => {
  
  if (!e) e = window.event;
  while (taskContainer.firstChild) {
    taskContainer.removeChild(taskContainer.firstChild);
  }
 

  const resultData = globalTaskData.filter(( title ) =>
    title.title.includes(e.target.value)
  );
  
  resultData.map((cardData) => {
    taskContainer.insertAdjacentHTML("beforeend", genrateHTML(cardData));
  });
};