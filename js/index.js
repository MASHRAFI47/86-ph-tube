const btnContainer = document.getElementById('btn-container');
const videoContainer = document.getElementById('video-container');
const noData = document.getElementById('no-data')
const sortBtn = document.getElementById('sort-btn');

let selectedCategory = 1000;

let sortByView = false

sortBtn.addEventListener('click', () => {
    sortByView = true;
    fetchCategoriesById(selectedCategory, sortByView)
})

let verifiedBadge = ''

let noVideo = ''

const fetchBtns = async () => {
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/categories`);
    const data = await res.json();
    const allData = data.data;
    console.log(allData)
    allData.slice(0,2)
    allData.forEach(element => {
        console.log(element)
        const newButton = document.createElement('button');
        newButton.classList = `category-btn btn ml-4 mb-4`
        const btn = element.category;
        newButton.innerText = btn;
        btnContainer.appendChild(newButton)

        newButton.addEventListener('click', () => {
            fetchCategoriesById(element.category_id)
            const allBtns = document.querySelectorAll('.category-btn');
            for (const btn of allBtns) {
                btn.classList.remove('bg-red-600')
            }
            newButton.classList.add('bg-red-600')
        })
    });
}

const fetchCategoriesById = async (categoryId, sortByView) => {
    selectedCategory = categoryId
    const res = await fetch(`https://openapi.programming-hero.com/api/videos/category/${categoryId}`)
    const data = await res.json();
    const allData = data.data;
    //sort btn
    if(sortByView) {
        allData.sort((a, b) => {
            const firstView = a.others.views;
            const secondView = b.others.views;
            const firstViewNum = parseFloat(firstView.replace("K", '')) || 0;
            const secondViewNum = parseFloat(secondView.replace("K", '')) || 0;
            const result = secondViewNum - firstViewNum;
            return result
        })
    }
    // no data found
    if (allData.length === 0) {
        noData.classList.remove('hidden')
    }
    else {
        noData.classList.add('hidden')
    }


    videoContainer.textContent = ''

    allData.forEach(element => {

        if (element.authors[0].verified) {
            verifiedBadge = `<img src="verify.png" width='20px' alt="Shoes" />`
        }
        const newCard = document.createElement('div');
        newCard.innerHTML = `
            <div class="card bg-base-100 shadow-xl">
                <figure><img src="${element.thumbnail}" alt="Shoes" /></figure>
                <div class="card-body">
                <h2 class="card-title">${element.title}</h2>
                <p class="font-semibold">${element.authors[0].profile_name}</p>
                ${verifiedBadge}
                <p>${element.others.views}</p>
                </div>
            </div>
        `
        videoContainer.appendChild(newCard)
    });
}
fetchCategoriesById(selectedCategory, sortByView)
fetchBtns();