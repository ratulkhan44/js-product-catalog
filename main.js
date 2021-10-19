//Seletor
let filterInput=document.getElementById('filter');
let productList=document.querySelector('.collection');
let singleProduct=document.querySelector('.collection-item');
let nameInput=document.querySelector('.product-name');
let priceInput=document.querySelector('.product-price');
let addBtn=document.querySelector('.add-product');
let deleteBtn=document.querySelector('.delete-product');
let msg=document.querySelector('.msg');


//State

const productData=[];


function getProductData(products){
    if(productData.length > 0 ){
        msg.textContent='';
        products.forEach(function(product){
            msg.textContent='';
            let li=document.createElement('li');
            li.className='list-group-item collection-item';
            li.id = `product-${product.id}`;
            li.innerHTML= `
            <strong>${product.name}</strong>- <span class="price">$${product.price}</span>
            <i class="fa fa-trash float-right delete-product"></i>
            `;
            productList.appendChild(li);
        })
    }else {
        msg.textContent="There is No product available";
    }
}

getProductData(productData);

addBtn.addEventListener('click', function(e){
    e.preventDefault();
    const productName = nameInput.value;
    const productPrice = priceInput.value;
    let id;
    if(productData.length === 0){
        id=0;
    }else{
        id=productData[productData.length-1].id + 1;
    }
    msg.textContent='';
    if(productName === '' || productPrice === '' || !(!isNaN(parseFloat(productPrice)) && isFinite(productPrice)) || productPrice < 0){
        alert('Plaese Fill Up necessary and Valid information');
    }else{
        productData.push(
            {
                id:id,
                name:productName,
                price:productPrice
            }
        );
        productList.innerHTML='';
        getProductData(productData);
        nameInput.value='';
        priceInput.value='';
    }
    
    
});