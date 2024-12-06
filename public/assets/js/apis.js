
function populateManufacturersAndModals(manufacturerSelectId, modalSelectId) {
    // Fetch manufacturers
    fetch('/api/manufacturers')
        .then(response => response.json())
        .then(data => {
            const manufacturers = data.ManuData;
            const manufacturerSelect = document.getElementById(manufacturerSelectId);
            const options = manufacturers.map(manufacturer => 
                `<option value="${manufacturer.name}" data-menu_id="${manufacturer.id}">${manufacturer.name}</option>`
            ).join('');
            
            manufacturerSelect.innerHTML += options;
        })
        .catch(error => console.error('Error fetching manufacturers:', error));

    // Fetch modals
    fetch('/api/modals')
        .then(response => response.json())
        .then(data => {
            const modals = data.modalData;
            const modalSelect = document.getElementById(modalSelectId);
            const modalOptions = modals.map(modalOption => (
                `<option value="${modalOption.modal_name}" data-menufecture="${modalOption.manufacturer_id}">${modalOption.modal_name}</option>`
            )).join('');
            
            modalSelect.innerHTML += modalOptions;
        })
        .catch(error => console.error('Error fetching modals:', error));

    // Event listener to filter modals based on selected manufacturer
    $(document).on("change", `#${manufacturerSelectId}`, function() {
        var menu_id = $(this).find(':selected').data('menu_id');
        $(`select#${modalSelectId} option`).each(function() {
            if ($(this).val() != "") {
                $(this).hide();
            }
        });
        $(`select#${modalSelectId} option[data-menufecture="${menu_id}"]`).show();
    });
}
populateManufacturersAndModals('manufacturerSelect', 'modalSelect');




