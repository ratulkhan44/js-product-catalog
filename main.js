//Seletor
let filterInputElm=document.getElementById('filter');
let productListElm=document.querySelector('.collection');
let singleProductElm=document.querySelector('.collection-item');
let nameInputElm=document.querySelector('.product-name');
let priceInputElm=document.querySelector('.product-price');
let addBtnElm=document.querySelector('.add-product');
let deleteBtnElm=document.querySelector('.delete-product');
let msgElm=document.querySelector('.msg');
let formElm=document.querySelector('form');


//State

let productData=getDataFromLocalStorage();
function getDataFromLocalStorage(){
    let products='';
    if(localStorage.getItem('productsData') === null){
        products=[];
    }else{
        products=JSON.parse(localStorage.getItem('productsData'));
    }
    return products;
}


function loadEventListener(){
    window.addEventListener('DOMContentLoaded',getProductData.bind(null,productData));
    formElm.addEventListener('click',addOrUpdateProduct)
    // addBtnElm.addEventListener('click', addProduct);
    productListElm.addEventListener('click',modifyOrRemoveProduct);
    filterInputElm.addEventListener('keyup',filterProduct);
}


function getProductData(products){
    productListElm.innerHTML='';
    if(products.length > 0 ){
        displayMessage();
        products.forEach(function({id,name,price}){
            let li=document.createElement('li');
            li.className='list-group-item collection-item';
            li.id = `product-${id}`;
            li.innerHTML= `
            <strong>${name}</strong>- <span class="price">$${price}</span>
            <i class="fa fa-trash float-right delete-product"></i>
            <i class="fa fa-edit float-right edit-product-icon mx-3"></i>
            `;
            productListElm.appendChild(li);
        })
    }else {
        displayMessage("There is No product available");
    }
}

function resetUI(){
    document.querySelector('.edit-product').remove();
    document.querySelector('#id').remove();
    addBtnElm.style.display='block';
}

let addProduct = (e) => {
    const productName = nameInputElm.value;
    const productPrice = priceInputElm.value;
    let id;
    if(productData.length === 0){
        id=1;
    }else{
        id=productData[productData.length-1].id + 1;
    }
    displayMessage();
    if(productName === '' || productPrice === '' || !(!isNaN(parseFloat(productPrice)) && isFinite(productPrice)) || productPrice < 0){
        alert('Plaese Fill Up necessary and Valid information');
    }else{
        let product={
            id:id,
            name:productName,
            price:productPrice
        }
        saveDataToLocalStorage(product);
        productListElm.innerHTML='';
        getProductData(productData);
        nameInputElm.value='';
        priceInputElm.value='';

    }
}

let updateProduct = (e) =>{
    e.preventDefault();
    const productName = nameInputElm.value;
    const productPrice = priceInputElm.value;
    const productId=parseInt(document.getElementById('id').value);
    console.log(productId);
    if(!productId  || productName === '' || productPrice === '' || !(!isNaN(parseFloat(productPrice)) && isFinite(productPrice)) || productPrice < 0){
        alert('Plaese Fill Up necessary and Valid information');
    }else{
        let productWithUpdate = productData.map(product=>{
            if(product.id === productId){
                return {
                    ...product,
                    name:productName,
                    price:productPrice
                }
            }else{
                return product;
            }
        })
        localStorage.removeItem('productsData');
        localStorage.setItem('productsData',JSON.stringify(productWithUpdate));
        productData=getDataFromLocalStorage()
        getProductData(productData);
        nameInputElm.value='';
        priceInputElm.value='';
        resetUI();
    }
}

function addOrUpdateProduct(e){
    if(e.target.classList.contains('add-product')){
        addProduct(e);
    }else if(e.target.classList.contains('edit-product')){
        updateProduct(e);
    }
}

function saveDataToLocalStorage(product){
    let items='';
    if(localStorage.getItem('productsData') === null){
        items=[];
        items.push(product);
        localStorage.setItem('productsData',JSON.stringify(items));
    }else{
        items=JSON.parse(localStorage.getItem('productsData'));
        items.push(product);
        localStorage.setItem('productsData',JSON.stringify(items));
    }
}

function deleteDataFromLocaStorage(id){
    let products=JSON.parse(localStorage.getItem('productsData'));
    let updateProductData=products.filter(function(product){
        return product.id !==id;
    });
    localStorage.setItem('productsData',JSON.stringify(updateProductData));
    if(updateProductData.length === 0) location.reload();
}

function findProduct(id){
    return productData.find((product) => product.id === id);
}

function populateEditFormUI(product){
    nameInputElm.value=product.name;
    priceInputElm.value=product.price;
    addBtnElm.style.display = 'none';
    let updateBtnElm= `<button class="btn mt-3 btn-block btn-info edit-product">Update</button>`
    let updateInputElm=`<input type="hidden" id="id" value=${product.id}>`
    if(!document.querySelector('#id')){
        document.forms[0].insertAdjacentHTML('beforeend',updateInputElm);
    }else{
        document.querySelector('#id').remove();
        document.forms[0].insertAdjacentHTML('beforeend',updateInputElm);
    }
    if(!document.querySelector('.edit-product')){
        document.forms[0].insertAdjacentHTML('beforeend',updateBtnElm);
    }
}

let modifyOrRemoveProduct = (e)=>{
    if(e.target.classList.contains('delete-product')){
        if(confirm('Are you Want to delete this product??')){
            let targetLiElm=e.target.parentElement;
        // targetLiElm.parentElement.removeChild(targetLiElm);
            let productId=parseInt(targetLiElm.id.split('-')[1]);
            let productDataUpdateByOwn=productData.filter(function(product){
                return product.id !==productId});
            productData=productDataUpdateByOwn;    
            deleteDataFromLocaStorage(productId);
            targetLiElm.remove();
        }

    }else if(e.target.classList.contains('edit-product-icon')){
        let targetLiElm=e.target.parentElement;
        let productId=parseInt(targetLiElm.id.split('-')[1]);
        let editProduct=findProduct(productId);
        if(editProduct){
            populateEditFormUI(editProduct);
        }
    }
}



let filterProduct=(e)=>{
    filterProduct=e.target.value.toLowerCase();
    itemLength=0;
    document.querySelectorAll('.collection .collection-item').forEach(function(product){
        let productName=product.firstElementChild.textContent.toLowerCase();
        if(productName.indexOf(filterProduct) === -1){
            product.style.display='none';
        }else{
            product.style.display='block';
            itemLength++;
        }
    });
    itemLength > 0 ? displayMessage() : displayMessage('Product Not Found');
}


function displayMessage(message=''){
    msgElm.textContent=message;
}

loadEventListener();