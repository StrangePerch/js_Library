const modal = document.querySelector("#modal");
const open_button = document.querySelector("#open_modal");
const close_span = document.querySelector("#close_modal");

const id_input = document.querySelector("#id_input");
const name_input = document.querySelector("#name_input");
const author_input = document.querySelector("#author_input");
const date_input = document.querySelector("#date_input");
const publisher_input = document.querySelector("#publisher_input");
const pages_input = document.querySelector("#pages_input");
const available_input = document.querySelector("#available_input");
const search_input = document.querySelector("#search_input");("#available_input");

const id_label = document.querySelector("#id_label");
const name_label = document.querySelector("#name_label");
const author_label = document.querySelector("#author_label");
const date_label = document.querySelector("#date_label");
const publisher_label = document.querySelector("#publisher_label");
const pages_label = document.querySelector("#pages_label");
const available_label = document.querySelector("#available_label");

const sort_select = document.querySelector("#sort_select");

const books_table = document.querySelector("#books_table");

let books = [];

let selected_id = 0;

let Storage = window.localStorage;

open_button.onclick = ShowModalAdd;
close_span.onclick = HideModal;

window.onclick = function(event) {
    if (event.target === modal) {
        HideModal();
    }
}

function ShowModal(buttons) {
    modal.style.display = "block";
    document.querySelector("#buttons").innerHTML = buttons;
    let id = 1;
    while(Has("id", id)) id++;
    id_input.value = id;
}

function ShowModalAdd()
{
    ShowModal("<button style=\"margin-top: 20px; width:280px\" id=\"add_button\" onclick=\"NewBook()\">Add</button>");
    CheckAll();
}

function ShowModalEdit()
{
    ShowModal(
        "<button style=\"margin-top: 20px; width:280px\" " +
        "id=\"save_button\" onclick=\"SaveBook()\">Save</button>" +
        "<button style=\"margin-top: 20px; width:280px\" " +
        "id=\"remove_button\" onclick=\"Remove()\">Delete</button>");
}

function HideModal() {
    modal.style.display = "none";
}

function Has(key, value) {
    return (books.find((book) => book[key] === value) !== undefined);
}

function CheckID() {
    if(!Has("id", parseInt(id_input.value)))
    {
        SetGreen(id_label);
        return true;
    }
    else {
        SetRed(id_label);
        return false;
    }
}

function CheckName() {
    if(!Has("name", name_input.value) && name_input.value.length > 3)
    {
        SetGreen(name_label);
        return true;
    }
    else {
        SetRed(name_label);
        return false;
    }
}

function CheckString(key) {
    let input = window[key + "_input"];
    let label = window[key + "_label"];
    if(input.value.length > 3)
    {
        SetGreen(label);
        return true;
    }
    else {
        SetRed(label);
        return false;
    }
}

function CheckInt(key) {
    let input = window[key + "_input"];
    let label = window[key + "_label"];
    if(isNumeric(input.value))
    {
        SetGreen(label);
        return true;
    }
    else {
        SetRed(label);
        return false;
    }
}

function CheckDate() {
    if(isValidDate(new Date(date_input.value)))
    {
        SetGreen(date_label);
        return true;
    }
    else {
        SetRed(date_label);
        return false;
    }
}

function CheckAll() {
   return CheckID() 
       & CheckName()
       & CheckString("author")
       & CheckString("publisher")
       & CheckDate()
       & CheckInt("pages")
       & CheckInt("available");
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function SetRed(label) {
    label.style.color = "red";
}

function SetGreen(label) {
    label.style.color = "green";
}

function GetShortDateString(date) {
    return date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
}

function AddBook(book) {
    books.push(book);
    books_table.innerHTML +=
        `<tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.author}</td>
            <td>${GetShortDateString(book.date)}</td>
            <td>${book.publisher}</td>
            <td>${book.pages}</td>
            <td>${book.available}</td>
            <td><button style="width: 100%; height: 100%; border: 0" onclick="EditBook(${book.id})"><span class="material-icons">edit</span></button></td>
        </tr>`;
    Save();
}

function Refresh() {
    books_table.innerHTML = "" +
        "<tr class=\"TableHeaders\">\n" +
        "     <th>ID</th>\n" +
        "     <th>Name</th>\n" +
        "     <th>Author</th>\n" +
        "     <th>Date</th>\n" +
        "     <th>Publisher</th>\n" +
        "     <th>Pages</th>\n" +
        "     <th>Available</th>\n" +
        "     <th>Edit</th>\n" +
        "</tr>";
    for (const book of books) {
        books_table.innerHTML +=
            `<tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.author}</td>
            <td>${book.date}</td>
            <td>${book.publisher}</td>
            <td>${book.pages}</td>
            <td>${book.available}</td>
            <td><button style="width: 100%; height: 100%; border: 0" onclick="EditBook(${book.id})"><span class="material-icons">edit</span></button></td>
        </tr>`;
    }
}

function EditBook(id) {
    ShowModalEdit();
    selected_id = id;
    let book = books.find(book => book.id === id);
    name_input.value = book.name;
    author_input.value = book.author;
    date_input.value = GetShortDateString(book.date);
    publisher_input.value = book.publisher;
    pages_input.value = book.pages;
    available_input.value = book.available;
    CheckAll();
    id_input.value= book.id;
    SetGreen(id_label);
    SetGreen(name_label);
}

function SaveBook() {
    RemoveBook(selected_id);
    NewBook();
    HideModal();
}

function Remove() {
    RemoveBook(selected_id);
}

function RemoveBook() {
    books.splice(books.find(book => book.id === selected_id), 1)
    Refresh();
}

function NewBook() {
    if(CheckAll())
    {
        AddBook({
            id: parseInt(id_input.value),
            name: name_input.value,
            author: author_input.value,
            date: new Date(date_input.value),
            publisher: publisher_input.value,
            pages: parseInt(pages_input.value),
            available: parseInt(available_input.value)});
        id_input.value = parseInt(id_input.value) + 1;
        CheckAll();
    }
    
}

let last_key = "";

function Sort() {
    let key = sort_select.value.toLowerCase();
    let desc = key === last_key;
    last_key = key;
    if(desc) last_key = "";
    books.sort((book_a, book_b) => {
        let a = book_a[key];
        let b = book_b[key];
        let is_a_searched = IsSearchedItem(book_a);
        let is_b_searched = IsSearchedItem(book_b);
        if(is_a_searched && !is_b_searched) return -1;
        if(!is_a_searched && is_b_searched) return 1;
        if (a < b) {
            if (desc)
                return 1;
            return -1;
        }
        if (a > b) {
            if (desc)
                return -1;
            return 1;
        }   
        return 0;
    });
    Refresh();
}

function IsSearchedItem(book) {
    let search = search_input.value;
    if(book.id === parseInt(search)) return true;
    if(book.name.includes(search)) return true;
    if(book.author.includes(search)) return true;
    if(book.publisher.includes(search)) return true;
    for (const val of book.date.split('-')) {
        if(val === search) return true;
    }
    if(book.pages === parseInt(search)) return true;
    if(book.available === parseInt(search)) return true;
    return false;
}

function Search() {
    Sort();
}

function Save()
{
    Storage.setItem("books", JSON.stringify(books));
}

function Load() {
    books = JSON.parse(Storage.getItem("books"));
    for (const book of books) {
        book.date = book.date.substring(0,10);
    }
    Refresh();
}

Load();

if(books === null)
{
    books = [];
    AddBook({
        id: 1, 
        name: "Name",
        author: "Author",
        date: "1995-12-17",
        publisher: "Publisher",
        pages: 60,
        available: 5});
}