
document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('click', function () {
        document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active-category'));
        this.classList.add('active-category');
        document.querySelectorAll('.service-list').forEach(serviceList => serviceList.classList.remove('visible'));
        const categoryId = this.getAttribute('data-category-id');
        const activeServiceList = document.getElementById('category-' + categoryId);
        if (activeServiceList) {
            activeServiceList.classList.add('visible');
        }
    });
});

document.querySelector('.category-item.active-category')?.click();

const selectedServices = [];

document.querySelectorAll('.service').forEach(item => {
    item.addEventListener('click', function () {

        const service_id = this.getAttribute('data-service-id');
        const service_name = this.getAttribute('data-service-name');
        const description = this.getAttribute('data-service-description');
        const service_charge = parseFloat(this.getAttribute('data-service-service_charge'));
        const index = selectedServices.findIndex(service => service.id === service_id);
        if (index === -1) {
            selectedServices.push({
                id: service_id,
                name: service_name,
                description: description,
                charge: service_charge
            });
        } else {
            selectedServices.splice(index, 1);
        }
        updateCart();
    });
});

function updateCart() {
    const cartSections = document.querySelectorAll('.selected-services-cart-value');
    const totalAmountElements = document.querySelectorAll('.final-amount-total');
    if (selectedServices.length === 0) {
        cartSections.forEach(cartSection => {
            cartSection.innerHTML = `<div class="text-gray-400">No services selected</div>`;
        });
        totalAmountElements.forEach(totalAmountElement => {
            totalAmountElement.innerHTML = '0';
        });
    } else {
        // Generate the HTML for the selected services
        let servicesHTML = selectedServices.map(service => `
            <div class="service-item">
                <div>
                    <h5>${service.name}</h5>
                    <input type='hidden' id="service_id" value="${service.id}" >
                    <p class="m-0 text-gray-400">${service.description}</p>
                </div>
                <div class="text-xl font-semibold">
                    <span class="font-sans">₤</span><span class="final-amount">${service.charge}</span>
                </div>
            </div>
        `).join('');

        cartSections.forEach(cartSection => {
            cartSection.innerHTML = servicesHTML;
        });

        const totalAmount = selectedServices.reduce((total, service) => total + service.charge, 0);
        totalAmountElements.forEach(totalAmountElement => {
            totalAmountElement.innerHTML = totalAmount.toFixed(2);
        });
    }

    // Update the appearance of service buttons
    document.querySelectorAll('.service').forEach(item => {
        const service_id = item.getAttribute('data-service-id');
        const isSelected = selectedServices.some(service => service.id === service_id);

        if (isSelected) {
            item.classList.add('selected');
            item.querySelector('span svg').style.display = 'block';
        } else {
            item.classList.remove('selected');
            item.querySelector('span svg').style.display = 'none';
        }
    });
}

// On page load, populate the cart if there are selected services in localStorage
document.addEventListener('DOMContentLoaded', () => {
    updateCart();
});

// Calender
const monthSelector = document.getElementById('monthSelector');
const daysContainer = document.getElementById('daysContainer');
const timeSlotsContainer = document.getElementById('timeSlotsContainer');
const prevMonthButton = document.getElementById('prevMonth');
const nextMonthButton = document.getElementById('nextMonth');
const prevWeekButton = document.getElementById('prevWeek');
const nextWeekButton = document.getElementById('nextWeek');

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentWeekStart = getCurrentWeekStart(); // Set to today's week initially

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function getCurrentWeekStart() {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const daysFromFirst = today.getDate() - 1; // zero-based index
    return Math.floor(daysFromFirst / 7); // Calculate week number
}

function updateMonthSelector() {
    monthSelector.innerHTML = '';
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month;
        monthSelector.appendChild(option);
    });
    monthSelector.value = currentMonth;
}
let selectedDayButton = null;
let selectedDate = '';

function renderDays() {
    daysContainer.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const today = new Date();

    // Normalize today to the beginning of the day
    today.setHours(0, 0, 0, 0);

    const startOfWeek = new Date(currentYear, currentMonth, 1 + currentWeekStart * 7);
    const endOfWeek = new Date(currentYear, currentMonth, startOfWeek.getDate() + 6);

    if (startOfWeek < firstDay) {
        startOfWeek.setDate(1);
    }

    for (let day = new Date(startOfWeek); day <= endOfWeek && day <= lastDay; day.setDate(day.getDate() + 1)) {
        const dayButton = document.createElement('button');
        dayButton.className = "border-2 rounded-xl p-4 w-20 h-24 hover:bg-red-50 hover:border-red-300";

        const formattedDate = `${day.getDate()}-${day.getMonth() + 1}-${day.getFullYear()}`;
        dayButton.innerHTML = `
            <div class="text-center">${day.toLocaleString('en-US', { weekday: 'short' })}</div>
            <div class="text-center text-2xl font-semibold">${day.getDate()}</div>
            <input type='hidden' id="selectedDate" value="${formattedDate}" />
        `;

        if (day < today) {
            dayButton.disabled = true;
            dayButton.classList.add('bg-gray-100', 'cursor-not-allowed');
        } else {
            dayButton.addEventListener('click', () => {
                // Remove the highlight from the previously selected button
                if (selectedDayButton) {
                    selectedDayButton.classList.remove('border-red-500');
                }
                selectedDayButton = dayButton;
                selectedDayButton.classList.add('border-red-500');
                selectedDate = formattedDate;

                getAvailableSlots(selectedDate);
            });
        }

        // Highlight today's date
        if (day.toDateString() === today.toDateString()) {
            dayButton.classList.add('bg-red-200');
        }

        daysContainer.appendChild(dayButton);
    }
}


function init() {
    updateMonthSelector();
    renderDays();
}

monthSelector.addEventListener('change', (e) => {
    currentMonth = parseInt(e.target.value);
    currentWeekStart = 0;
    renderDays();
});

prevMonthButton.addEventListener('click', () => {
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    if (currentMonth === 11) currentYear--;
    currentWeekStart = 0;
    updateMonthSelector();
    renderDays();
});

nextMonthButton.addEventListener('click', () => {
    currentMonth = (currentMonth === 11) ? 0 : currentMonth + 1;
    if (currentMonth === 0) currentYear++;
    currentWeekStart = 0; // Reset week to the first week of the new month
    updateMonthSelector();
    renderDays();
});

prevWeekButton.addEventListener('click', () => {
    if (currentWeekStart > 0) {
        currentWeekStart--;
        renderDays();
    }
});

nextWeekButton.addEventListener('click', () => {
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    if (currentWeekStart < Math.floor((lastDay.getDate() - 1) / 7)) {
        currentWeekStart++;
        renderDays();
    }
});

init();

function getAvailableSlots(date) {
    // Fetch available slots for the selected date
    fetch(`/api/get-slots?date=${date}`)
        .then(response => response.json())
        .then(data => {
            const slotsContainer = document.getElementById('timeSlotsContainer');
            slotsContainer.innerHTML = '';  // Clear existing slots

            // Check if any slots were returned
            if (data.slots.length > 0) {
                // Create slot elements for available slots
                const slotsContent = data.slots.map(slot => {
                  
                    return `
                        <div class="p-5 border-[2px] rounded-md text-center cursor-pointer hover:border-red-500" 
                             data-id="${slot.id}" onclick="selectSlot(${slot.id}, this)">
                             <input type='hidden' id="slotTime" value="${slot.slot_time}">
                            <span>${slot.slot_time}</span>
                        </div>
                    `;
                }).join('');

                slotsContainer.innerHTML = slotsContent;
            } else {
                // If no slots are available for the date, show a message
                slotsContainer.innerHTML = '<div class="p-5 text-center">No slots available for this date.</div>';
            }
        })
        .catch(error => {
            console.error('Error fetching slots:', error);
        });
}
 

renderDays()

let selectedSlotTime = '';

function selectSlot(slotId, element) {
    document.querySelectorAll('.selected-slot').forEach(el => {
        el.classList.remove('border-red-500', 'selected-slot');
    });

    // Add red border to the currently selected slot
    element.classList.add('border-red-500', 'selected-slot');

    // Set the selected slot time to the span's text
    selectedSlotTime = element.querySelector('span').textContent;
}


getAvailableSlots()

document.addEventListener("DOMContentLoaded", function () {
    // Open the modal
    document.getElementById("openModal").addEventListener("click", function () {

        document.getElementById('orderModal').style.display = 'block';
    });

    // Close the modal
    document.getElementById("closeModal").addEventListener("click", function () {
        document.getElementById('orderModal').style.display = 'none';
    });
});


document.getElementById("submitInfo").addEventListener('click', function () {
    var name = document.getElementById('name').value
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var address = document.getElementById("address").value;
    var message = document.getElementById("message").value;
    var manufacturer = document.getElementById("manufacturer").value;
    var car_model = document.getElementById("car_model").value;
    var generation = document.getElementById("generation").value;

    // Instead of redefining selectedServices, use the existing global array
    const selectedServiceIds = selectedServices.map(service => service.id); // Get the ids from the existing array

    if (selectedServiceIds.length === 0) {
        alert('Please select at least one service.');
        return;
    }

    if (selectedSlotTime.length === 0) {
        alert('Please select time slot.');
        return;
    }

    const data = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        message: message,
        service_date: selectedDate,
        manufacturer: manufacturer,
        car_model:car_model,
        generation:generation,
        services: selectedServiceIds,
        slotTime: selectedSlotTime
    };

    fetch('/api/store-services', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                window.location.href = 'thank-you'
            } else {
                alert('Error booking appointment: ' + result.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while booking the appointment.');
        });
});




