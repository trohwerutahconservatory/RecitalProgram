let sheetData = null;
let currentRecitalTime = null;
const select = document.getElementById("possible_times");
const programList = document.querySelector("ul");
const loading = document.getElementById("loading");

let programsByTime = {};

async function loadData() {

    loading.style.display = "flex";

    const response = await fetch(urlForSheetJSON_DATA);
    sheetData = await response.json();

    loading.style.display = "none";

    groupProgramsByTime(sheetData);
    populateRecitalTimes(sheetData);
}

function groupProgramsByTime(data) {

    programsByTime = {};

    data.data.forEach(entry => {

        const time = entry.Time;

        if (!programsByTime[time]) {
            programsByTime[time] = [];
        }

        programsByTime[time].push(entry);

    });

}



function populateRecitalTimes(data) {

    data.recitalInfo_RecitalTimes.forEach(time => {
        const option = document.createElement("option");

        option.value = time;
        option.textContent = time;

        select.appendChild(option);
    });

}

function handleRecitalChange(event) {

    const selected = event.target.value;

    if (selected === "Select") return;

    currentRecitalTime = parseInt(selected);

    renderProgram();
}

function renderProgram() {

    clearProgram();

    setRecitalTime(currentRecitalTime);

    changeLocationElement(sheetData.recitalInfo_Location);
    changeRecitalDescriptionElement(sheetData.recitalInfo_RecitalTitle);

    buildAllMusicalNumbers();

    const footerContainer = createFooterContainer();

    buildFooterRefreshements(footerContainer);
    buildFooterHonors(sheetData.recitalInfo_FooterHonors, footerContainer);

    footerContainer.appendChild(document.createElement("br"));

    buildFooterEtiquette(sheetData.recitalInfo_FooterEtiquette, footerContainer);
}

select.addEventListener("change", handleRecitalChange);

window.addEventListener("DOMContentLoaded", loadData);

//GENERAL FUNCTIONS FOR HTML




function clearProgram()
{
    programList.innerHTML = "";

    const footer = document.querySelector("footer");
    if (footer) {
        footer.remove(); // removes the previously generated footer
    }
}

function newHTMLElement(theStyle, theType, theText)
{
    const newElement_ofType_wText = document.createElement(theStyle);
    newElement_ofType_wText.className = theType;
    newElement_ofType_wText.textContent = theText;
   
    programList.appendChild(newElement_ofType_wText);
    let parentNode_forElement = newElement_ofType_wText.parentNode;

    return parentNode_forElement;
}

function lineBreak()
{
    return document.createElement("br");
}

function createFooterContainer()
{
    const footer = document.createElement("footer");

    const container = document.createElement("div");
    container.className = "print-footer";

    footer.appendChild(container);
    document.body.appendChild(footer);

    return container;
}

function addFooterLine(container, text, className)
{
    const line = document.createElement("div");  // <-- change from span
    line.className = className;
    line.textContent = text;

    container.appendChild(line);
}

//RECITAL PROGRAM SPECIFIC
//Global Variables

const urlForSheetJSON_DATA = "https://script.google.com/macros/s/AKfycbwZJEanfe_X9ynNQRVf5VDLQwZYOlX-MM8UXxmqwwCfcsBTRJ7BXZxF4WeIgXOBzCjl/exec";

function changeRecitalTimeElement (recitalTime_fromSheet)
{
    let recitalTime = document.querySelector(".recitalTime");
    recitalTime.textContent = recitalTime_fromSheet;
}

function changeLocationElement (recitalPlace_fromSheet)
{
    let locationElement = document.querySelector(".recitalPlace");
    locationElement.textContent = recitalPlace_fromSheet;
}

function changeRecitalDescriptionElement (recitalDescription_fromSheet)
{
    let descriptionElement = document.querySelector(".recitalDescription");
    descriptionElement.textContent = recitalDescription_fromSheet;
}


//Adds a musicalnumber into the <li> element.
function buildIndividualMusicalNumber(performer, piece, teacher, composer)
{
    const container = document.createElement("li");
    container.className = "musical-number";

    if (performer) {
        const performerEl = document.createElement("div");
        performerEl.className = "performer";
        performerEl.textContent = performer;
        container.appendChild(performerEl);
    }

    if (piece) {
        const pieceEl = document.createElement("div");
        pieceEl.className = "piece";
        pieceEl.textContent = piece;
        pieceEl.appendChild(lineBreak());
        container.appendChild(pieceEl);
    }

    if (teacher) {
        const teacherEl = document.createElement("div");
        teacherEl.className = "teacherinfo";
        teacherEl.textContent = teacher;
        container.appendChild(teacherEl);
    }

    if (composer) {
        const composerEl = document.createElement("div");
        composerEl.className = "composer";
        composerEl.textContent = composer;
        composerEl.appendChild(lineBreak());
        composerEl.appendChild(lineBreak());
        container.appendChild(composerEl);
    }

    programList.appendChild(container);
}

function newHTMLMusicalNumber (theType, theText)
{
    return newHTMLElement ('li', theType, theText);
}

function buildAllMusicalNumbers() {

    const recitalEntries = programsByTime[currentRecitalTime] || [];

    recitalEntries.forEach(entry => {

        buildIndividualMusicalNumber(
            entry.Performer,
            entry.Piece,
            entry.InstrumentTeacher,
            entry.Composer
        );

    });
}

function buildFooterRefreshements(container)
{
    addFooterLine(container, "Refreshements to Follow Recital", "footer");
}

function buildFooterHonors(recitalFooterHonors_fromSheet, container)
{
    recitalFooterHonors_fromSheet.forEach(item => {
        addFooterLine(container, item, "footerHonors");
    });
}

function buildFooterEtiquette(recitalFooterEtiquette_fromSheet, container)
{
    recitalFooterEtiquette_fromSheet.forEach(item => {
        addFooterLine(container, item, "footerEtiquette");
    });
}

//FOR GETTING DATA AND LOADING PAGE


        
function setRecitalTime (time)
{
    let recitalTime_HTMLElement = document.querySelector(".recitalTime");
    let time_AMPM = "";
    let finaleTime = "";
    if (time=="Select")
    {        
        finaleTime = "";
    }
    else if (time==12)
    {
        time_AMPM = "PM";
        finaleTime = time+time_AMPM;
    }
    else if(time>7)
    {
        time_AMPM = "AM";        
        finaleTime = time+time_AMPM;
    } 
    else
    {
        time_AMPM = "PM";        
        finaleTime = time+time_AMPM;
    }
    
    recitalTime_HTMLElement.textContent = finaleTime;
}
