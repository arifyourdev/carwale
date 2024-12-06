// ENGINE API
document.addEventListener("DOMContentLoaded", () => {
    let carPartsData = [];

    // Fetch Engine
    fetch('/api/car-parts')
        .then(response => response.json())
        .then(data => {
            carPartsData = data.carPartsData;
            renderCars(carPartsData);

            // Add event listeners for filtering after data is fetched
            document.getElementById('manufacturerSelect').addEventListener('change', filterCars);
            document.getElementById('modalSelect').addEventListener('change', filterCars);
            document.getElementById('generationSelect').addEventListener('change', filterCars);
            document.getElementById('searchEngine').addEventListener('input', filterCars);
            document.querySelector('[name="sort"]').addEventListener('change', filterCars);
        })
        .catch(error => console.error('Error fetching engines:', error));

    // Function to render engines
    function renderCars(cars) {
        const carGrid = document.getElementById("carGrid");
        const messageContainer = document.getElementById("messageContainer");
        const totalItems = document.getElementById("totalCarItems");
        totalItems.textContent = `We found over ${cars.length} results`
        carGrid.innerHTML = '';
        messageContainer.innerHTML = ''; 
        if (cars.length === 0) {
            messageContainer.innerHTML = `
                <div>
                    <img src="assets/images/others/empy-service.svg" alt="">
                </div>
                    <div class="text-center">
                    <h4 class="text-3xl font-[600] mb-5">No Matching Items Found</h4>
                    <p class="text-gray-500">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum scelerisque, <br>
                        augue sed cursus porttitor, libero purus gravida magna.</p>
                    </div>
                    <div class="mt-10">
                    <a href="/contact-us" class="rounded-[50px] bg-red-600 text-white p-3 px-10"> Contact Us</a>
                    </div>
            `;
            return;
        }
        cars.forEach(car => {
            const carCard = `
                <div class="box bg-white p-3">
                    <div class="img bg-gray-200 flex justify-center py-3">
                        <img src="${car.main_image_path}" alt="${car.part_name}" />
                    </div>
                    <div class="py-3 px-2">
                        <h2 class="text-[20px] font-bold">${car.part_name}</h2>
                        <p class="text-gray-500 text-[14px]">${car.manufacturer}</p>
                        <p class="text-gray-500 text-[14px]">Content is pending..</p>
                        <h3 class="text-[24px] mt-3 font-bold">£${car.price}</h3>
                    </div>
                    <div class="px-2">
                        <a href="car-part-detail/${car.seo_url}" class="w-[100%] block p-2 bg-red-700 text-white rounded-[20px] text-center">
                            View Details
                        </a>
                    </div>
                </div>
            `;
            carGrid.innerHTML += carCard;
        });
    }

    // Filter function
    function filterCars() {
        const manufacturer = document.getElementById('manufacturerSelect').value;
        const model = document.getElementById('modalSelect').value;
        const generation = document.getElementById('generationSelect').value;
        const searchQuery = document.getElementById('searchEngine').value.toLowerCase();
        const sortOption = document.querySelector('[name="sort"]').value;

        const filteredEngines = carPartsData.filter(car => {
            const matchesSearchQuery = (
                car.part_name.toLowerCase().includes(searchQuery) ||
                car.manufacturer.toLowerCase().includes(searchQuery) ||
                car.price.toString().toLowerCase().includes(searchQuery)
            );
            return (
                (manufacturer === "" || car.manufacturer === manufacturer) &&
                (model === "" || car.c_modal === model) &&
                (generation === "" || car.c_gen === generation) &&
                matchesSearchQuery
            );
        });

         // Sorting logic
         if (sortOption === "Latest First") {
            filteredEngines.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (sortOption === "Previous First") {
            filteredEngines.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }

        renderCars(filteredEngines);
    }
});