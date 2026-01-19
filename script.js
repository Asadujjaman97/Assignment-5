document.addEventListener("DOMContentLoaded", () => {
    // -------------------------
    // CONSTANTS
    // -------------------------
    const TOTAL_SEATS = 40;
    const SEAT_PRICE = 550;
    const COUPON_DISCOUNT = 100;
    const MAX_SEATS_NO_COUPON = 4;
    const MAX_SEATS_WITH_COUPON = 2;

    // -------------------------
    // STATE VARIABLES
    // -------------------------
    let selectedSeats = [];  // No seats selected by default
    let couponApplied = false;

    // -------------------------
    // ELEMENTS
    // -------------------------
    const seatButtons = Array.from(document.querySelectorAll("#Tickets button")).filter(btn => btn.dataset.seat);
    const totalPriceEl = document.getElementById("totalPrice");
    const grandTotalEl = document.getElementById("grandTotal");
    const couponInput = document.getElementById("couponInput");
    const applyBtn = document.getElementById("applyCoupon");
    const seatBookedEl = document.getElementById("seatBooked");
    const seatLeftEl = document.getElementById("seatLeft");
    const selectedSeatCountEl = document.getElementById("selectedSeatCount");
    const nextBtn = document.querySelector("form button");
    const modal = document.getElementById("confirmationModal");
    const modalContent = document.getElementById("modalContent");
    const closeModalBtn = document.getElementById("closeModal");
    const successModal = document.getElementById("successModal");
    const continueBtn = document.getElementById("continueBtn");

    // -------------------------
    // INITIALIZE SEATS
    // -------------------------
    seatButtons.forEach(btn => {
        btn.classList.remove("seat-selected");
        btn.classList.add("seat-available");
    });

    // -------------------------
    // HELPER FUNCTIONS
    // -------------------------
    function updateSeatCount() {
        const booked = selectedSeats.length;
        const left = TOTAL_SEATS - booked;

        seatBookedEl.textContent = booked;
        seatLeftEl.textContent = left;
        selectedSeatCountEl.textContent = booked;
    }

    function updatePrice() {
        let total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
        if (couponApplied) total -= selectedSeats.length * COUPON_DISCOUNT;

        totalPriceEl.textContent = `BDT ${total}`;
        grandTotalEl.textContent = `BDT ${total}`;
    }
    function updateGrayBox() {
        const list = document.getElementById("graySeatList");
        const totalEl = document.getElementById("grayTotal");

        if (!list || !totalEl) return;

        list.innerHTML = "";

        selectedSeats.forEach(seat => {
            const row = document.createElement("div");
            row.className = "grid grid-cols-3";

            row.innerHTML = `
            <span>${seat.seat}</span>
            <span>${seat.class}</span>
            <span class="text-right">${seat.price}</span>
        `;

            list.appendChild(row);
        });

        totalEl.textContent = `BDT ${selectedSeats.length * SEAT_PRICE}`;
    }


    // -------------------------
    // SEAT CLICK HANDLER
    // -------------------------
    seatButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const seatNum = btn.dataset.seat;
            const seatClass = "Economy";
            const seatPrice = SEAT_PRICE;
            const maxSeats = couponApplied ? MAX_SEATS_WITH_COUPON : MAX_SEATS_NO_COUPON;

            const index = selectedSeats.findIndex(s => s.seat === seatNum);

            if (index > -1) {
                // Deselect seat
                selectedSeats.splice(index, 1);
                btn.classList.remove("seat-selected");
                btn.classList.add("seat-available");
            } else {
                // Select seat
                if (selectedSeats.length >= maxSeats) {
                    alert(`Maximum ${maxSeats} seats allowed${couponApplied ? " with coupon" : ""}`);
                    return;
                }
                selectedSeats.push({ seat: seatNum, price: seatPrice, class: seatClass });
                btn.classList.add("seat-selected");
                btn.classList.remove("seat-available");
            }

            updateSeatCount();
            updatePrice();
            updateGrayBox();

        });
    });

    // -------------------------
    // COUPON HANDLER
    // -------------------------
    if (applyBtn) {
        applyBtn.addEventListener("click", () => {
            const code = couponInput.value.trim();
            if (!code) return alert("Enter coupon code");

            if (selectedSeats.length > MAX_SEATS_WITH_COUPON) {
                return alert(`Coupon allows maximum ${MAX_SEATS_WITH_COUPON} seats`);
            }

            couponApplied = true;
            alert(`Coupon applied: ${COUPON_DISCOUNT}৳ off per ticket`);
            updatePrice();
        });
    }

    // -------------------------
    // MODAL HANDLER
    // -------------------------
    if (nextBtn && modal && modalContent) {
        nextBtn.addEventListener("click", e => {
            e.preventDefault();

            if (selectedSeats.length === 0) {
                alert("Please select at least one seat.");
                return;
            }

            modalContent.innerHTML = "";

            selectedSeats.forEach(s => {
                const div = document.createElement("div");
                div.className = "flex justify-between";
                div.innerHTML = `<span>${s.seat}</span><span>${s.class}</span><span>BDT ${s.price}</span>`;
                modalContent.appendChild(div);
            });

            const totalDiv = document.createElement("div");
            totalDiv.className = "flex justify-between font-bold mt-4 border-t pt-2";
            const total = selectedSeats.reduce((sum, s) => sum + s.price, 0) - (couponApplied ? selectedSeats.length * COUPON_DISCOUNT : 0);
            totalDiv.innerHTML = `<span>Total</span><span>BDT ${total}</span>`;
            modalContent.appendChild(totalDiv);

            successModal.classList.remove("hidden");
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }

    // -------------------------
    // CONTINUE BUTTON HANDLER
    // -------------------------
    if (continueBtn) {
        continueBtn.addEventListener("click", () => {
            successModal.classList.add("hidden");

            selectedSeats = [];
            couponApplied = false;

            seatButtons.forEach(btn => {
                btn.classList.remove("seat-selected");
                btn.classList.add("seat-available");
            });

            updateSeatCount();
            updatePrice();

            document.querySelector("form").reset();
        });
    }


    updateSeatCount();
    updatePrice();
});
const rt_routeMap = {
    "Dhaka - Sylhet": { boarding: "Dhaka", dropping: "Sylhet" },
    "Dhaka - Hobigonj": { boarding: "Dhaka", dropping: "Hobigonj" },
    "Sylhet - Dhaka": { boarding: "Sylhet", dropping: "Dhaka" },
    "Hobigonj - Dhaka": { boarding: "Hobigonj", dropping: "Dhaka" }
};

function rt_selectRoute(route) {
    document.getElementById("rt_routeText").innerText = route;

    const data = rt_routeMap[route];
    if (data) {
        document.getElementById("rt_boardingText").innerText = data.boarding;
        document.getElementById("rt_droppingText").innerText = data.dropping;
    }
}

function rt_selectTime(time) {
    document.getElementById("rt_timeText").innerText = time;
}
function rt_setActive(className, element) {
    document.querySelectorAll('.' + className).forEach(btn => {
        btn.classList.remove('bg-black', 'text-white', 'border-black');
    });

    element.classList.add('bg-black', 'text-white', 'border-black');
}

document.querySelectorAll('.rt-route-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        rt_setActive('rt-route-btn', this);
    });
});

document.querySelectorAll('.rt-time-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        rt_setActive('rt-time-btn', this);
    });
});