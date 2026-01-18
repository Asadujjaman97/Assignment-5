document.addEventListener("DOMContentLoaded", () => {
    // -------------------------
    // CONSTANTS
    // -------------------------
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
    // Only select buttons with a data-seat attribute
    const seatButtons = Array.from(document.querySelectorAll("#Tickets button")).filter(btn => btn.dataset.seat);
    const totalPriceEl = document.getElementById("totalPrice");
    const grandTotalEl = document.getElementById("grandTotal");
    const seatCountEl = document.getElementById("seatCount");
    const couponInput = document.getElementById("couponInput");
    const applyBtn = document.getElementById("applyCoupon");

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
        seatCountEl.textContent = selectedSeats.length;
    }

    function updatePrice() {
        let total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
        if (couponApplied) total -= selectedSeats.length * COUPON_DISCOUNT;

        totalPriceEl.textContent = `BDT ${total}`;
        grandTotalEl.textContent = `BDT ${total}`;
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

            // Check if seat is already selected
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
            e.preventDefault(); // Prevent form submission

            if (selectedSeats.length === 0) {
                alert("Please select at least one seat.");
                return;
            }

            // Clear previous modal content
            modalContent.innerHTML = "";

            // Add selected seats
            selectedSeats.forEach(s => {
                const div = document.createElement("div");
                div.className = "flex justify-between";
                div.innerHTML = `<span>${s.seat}</span><span>${s.class}</span><span>BDT ${s.price}</span>`;
                modalContent.appendChild(div);
            });

            // Add total price
            const totalDiv = document.createElement("div");
            totalDiv.className = "flex justify-between font-bold mt-4 border-t pt-2";
            const total = selectedSeats.reduce((sum, s) => sum + s.price, 0) - (couponApplied ? selectedSeats.length * COUPON_DISCOUNT : 0);
            totalDiv.innerHTML = `<span>Total</span><span>BDT ${total}</span>`;
            modalContent.appendChild(totalDiv);

            // Show modal
            successModal.classList.remove("hidden");

        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener("click", () => modal.classList.add("hidden"));
    }

    // -------------------------
    // INITIAL DISPLAY
    // -------------------------
    updateSeatCount();
    updatePrice();
});
continueBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");

    // reset system
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


