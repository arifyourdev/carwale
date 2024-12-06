// ENGINE API
document.addEventListener("DOMContentLoaded", () => {
    let engineAllData = [];

    // Fetch Engine
    fetch('/api/engines')
        .then(response => response.json())
        .then(data => {
            engineAllData = data.engineAllData;
            renderEngines(engineAllData);

            // Add event listeners for filtering after data is fetched
            document.getElementById('manufacturerSelect').addEventListener('change', filterEngines);
            document.getElementById('modalSelect').addEventListener('change', filterEngines);
            document.getElementById('generationSelect').addEventListener('change', filterEngines);
            document.getElementById('searchEngine').addEventListener('input', filterEngines);
            document.querySelector('[name="sort"]').addEventListener('change', filterEngines);
        })
        .catch(error => console.error('Error fetching engines:', error));

    // Function to render engines
    function renderEngines(engines) {
        const engineGrid = document.getElementById("engineGrid");
        const messageContainer = document.getElementById("messageContainer");
        const totalItems = document.getElementById("totalItems");
        totalItems.textContent = `We found over ${engines.length} results`
        engineGrid.innerHTML = '';
        messageContainer.innerHTML = ''; 
        if (engines.length === 0) {
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
        engines.forEach(engine => {
            const engineCard = `
                <div class="box bg-white p-3">
                    <div class="img bg-gray-200 flex justify-center py-3">
                        <img src="${engine.main_image_path}" alt="${engine.engine_name}" />
                    </div>
                    <div class="py-3 px-2">
                        <h2 class="text-[20px] font-bold">${engine.engine_name}</h2>
                        <p class="text-gray-500 text-[14px]">${engine.manufacturer}</p>
                        <p class="text-gray-500 text-[14px]">Content is pending..</p>
                        <h3 class="text-[24px] mt-3 font-bold">£${engine.price}</h3>
                    </div>
                    <div class="px-2">
                        <a href="engine-detail/${engine.seo_url}" class="w-[100%] block p-2 bg-red-700 text-white rounded-[20px] text-center">
                            View Details
                        </a>
                    </div>
                </div>
            `;
            engineGrid.innerHTML += engineCard;
        });
    }

    // Filter function
    function filterEngines() {
        const manufacturer = document.getElementById('manufacturerSelect').value;
        const model = document.getElementById('modalSelect').value;
        const generation = document.getElementById('generationSelect').value;
        const searchQuery = document.getElementById('searchEngine').value.toLowerCase();
        const sortOption = document.querySelector('[name="sort"]').value;

        const filteredEngines = engineAllData.filter(engine => {
            const matchesSearchQuery = (
                engine.engine_name.toLowerCase().includes(searchQuery) ||
                engine.manufacturer.toLowerCase().includes(searchQuery) ||
                engine.price.toString().toLowerCase().includes(searchQuery)
            );
            return (
                (manufacturer === "" || engine.manufacturer === manufacturer) &&
                (model === "" || engine.c_modal === model) &&
                (generation === "" || engine.c_gen === generation) &&
                matchesSearchQuery
            );
        });

         // Sorting logic
         if (sortOption === "Latest First") {
            filteredEngines.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // Sort by latest release date
        } else if (sortOption === "Previous First") {
            filteredEngines.sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Sort by oldest release date
        }

        renderEngines(filteredEngines);
    }
});