const URL = {
    productList: (sort = "asc") => `https://fakestoreapi.com/products?sort=${sort}`,
    categories: "https://fakestoreapi.com/products/categories",
    productByCategory: (catagoryName) => `https://fakestoreapi.com/products/category/${catagoryName}`
}
const Data = {
    items: [],
    category: []
}
const Products = {
    options: {
        element: $,
        items: []
    },
    init: function (element, options) {
        this.options.element = element
        this.setItems(options.items)
        return this
    },
    setItems: function (items) {
        this.options.items = items
    },
    getItems: function () {
        return this.options.items
    },
    render: function () {
        if (this.options.element.length) {

            this.options.element.empty()

            this.options.items.forEach(item => {

                let rate = (rate) => {
                    let rateFull = Math.floor(rate);
                    let rateHTML = '';
                    for (let i = 1; i <= rateFull; i++) {
                        rateHTML += `<li><i class="fas fa-star"></i></li>`
                    }
                    if (rate - rateFull > 0) {
                        rateHTML += `<li><i class="fas fa-star-half-alt"></i></li>`
                    }
                    return rateHTML
                };
                const templateItem = (product) =>
                    `
                    <li class="product-item" id="product-${product?.id}">
                        <div class="product-item-info">
                        <div class="product-photo-wrapper">
                            <a href="" title="">
                            <picture>
                                <source />
                                <img class="image" src="${product?.image}" alt="" />
                            </picture>
                            </a>

                        </div>
                        <div class="product-item-details">

                            <div class="product-item-description">
                            <h3 class="description">${product?.description}</h3>
                            </div>
                            <div class="product-item-price">
                            <p class="product-price">
                                <span class="currency">$</span><span class="money">${product?.price}</span>
                            </p>
                            <p class="discount">50% OFF</p>
                            </div>

                            <div class="product-item-note">
                            <p> ${product?.title}
                            </p>
                            </div>

                            <div class="product-item-reviews">

                            <div class="rating-stars">
                                <ul class="star">                  
                                    ${rate(product?.rating?.rate)}
                                </ul>
                                <span class="point-number">${product?.rating?.rate}
                                </span>
                            </div>
                            <button class="watch">
                                <i class="fas fa-heart"></i>
                                <span>Watch</span>
                            </button>
                            </div>
                        </div>
                    </li>
                 `
                this.options.element.append(templateItem(item))
            })
        }
    },
    sort: function(field, positions = "asc"){
        switch (field) {
            case 'price':
                this.options.items.sort((o1,o2)=> positions === 'desc'? o2.price - o1.price : o1.price - o2.price);
                break;
            case 'most_popular':
                this.options.items.sort((o1,o2)=>  positions === 'desc'?o2.rating.count - o1.rating.count: o1.rating.count - o2.rating.count)
            default:
                break;
        }
        this.render()
        
    }
}

const reRenderProduct = () =>{
    Products.setItems(Data.items)
    Products.render()
}

const request = (url) => {
    return $.getJSON(url,
        function (data, textStatus, jqXHR) {
            if (jqXHR.status === 200) {
                return data;
            }
        })
}

const onClickCategory = (e)=>{
    debugger
    let catagoryName = $(e.currentTarget ).data("name");
    let updateData = async () => {
        let items = await request(URL.productByCategory(catagoryName))
        Data.items = items;
        reRenderProduct();
    }
    updateData()
}

onClickShowAll = (e)=>{
   
    $(".activate",$(e.target).parent()).removeClass("activate")
    $(e.target).addClass("activate")
    let updateData = async () => {
        let items = await request(URL.productList())
        Data.items = items;
        reRenderProduct();
    }
    updateData()
}


async function main() {
    let productList = await request(URL.productList("asc"));
    let catagory = await request(URL.categories);
    Data.category = catagory
    Data.items = productList

    Products.init($("#products"), { items: Data.items }).render()
    
    Data.category.forEach((i) => {
        $("#related").append($(`<li class="item" data-name="${i}">${i}</li>`).click(onClickCategory))
        
        $("#list-category").append(
            $(`
                <li class="item" data-name="${i}">
                    <div class="content">
                    <p class="title">${i}</p>
                    ${i?.caption ? `<p class="caption">${i?.caption}</p>`:""}
                    </div>
                </li>
            `).click(onClickCategory)
        )
    })

    $("#sort-by").change(function (e) { 
        e.preventDefault();
        $("#sort-conditions").val("")
        Products.sort($(this).val())
    });
    
    $("#sort-conditions").change(function(e){
        Products.sort($("#sort-by").val(),$(this).val())
    })

    $(".all-categories").click(onClickShowAll)
    
    
}

main();