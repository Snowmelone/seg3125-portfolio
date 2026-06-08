const repairOptions = document.querySelectorAll(".repair-option");
const serviceSelect = document.getElementById("serviceNeeded");
const deviceSelect = document.getElementById("deviceType");
const dateInput = document.getElementById("preferredDate");
const timeSelect = document.getElementById("preferredTime");
const nameInput = document.getElementById("customerName");
const bookingForm = document.getElementById("bookingForm");
const confirmationCard = document.getElementById("confirmationCard");
const resetBookingButton = document.getElementById("resetBooking");
const closeConfirmationButton = document.getElementById("closeConfirmation");

const summaryDevice = document.getElementById("summaryDevice");
const summaryService = document.getElementById("summaryService");
const summaryPrice = document.getElementById("summaryPrice");
const summaryRepairTime = document.getElementById("summaryRepairTime");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");

const previewService = document.getElementById("previewService");
const previewPrice = document.getElementById("previewPrice");
const previewTime = document.getElementById("previewTime");

const confirmationMessage = document.getElementById("confirmationMessage");
const confirmService = document.getElementById("confirmService");
const confirmDevice = document.getElementById("confirmDevice");
const confirmDate = document.getElementById("confirmDate");
const confirmTime = document.getElementById("confirmTime");

const appointmentList = document.getElementById("appointmentList");
const emptyAppointments = document.getElementById("emptyAppointments");

const STORAGE_KEY = "cpuRAppointments";

function getSelectedServiceOption() {
  return serviceSelect.options[serviceSelect.selectedIndex];
}

function getAppointments() {
  const savedAppointments = localStorage.getItem(STORAGE_KEY);

  if (!savedAppointments) {
    return [];
  }

  return JSON.parse(savedAppointments);
}

function saveAppointments(appointments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

function updateSummary() {
  const selectedOption = getSelectedServiceOption();

  summaryDevice.textContent = deviceSelect.value;
  summaryService.textContent = serviceSelect.value;
  summaryPrice.textContent = selectedOption.dataset.price;
  summaryRepairTime.textContent = selectedOption.dataset.time;
  summaryDate.textContent = dateInput.value || "Not selected";
  summaryTime.textContent = timeSelect.value || "Not selected";

  previewService.textContent = serviceSelect.value;
  previewPrice.textContent = selectedOption.dataset.price;
  previewTime.textContent = selectedOption.dataset.time;
}

function setActiveRepairOption(serviceName) {
  repairOptions.forEach((option) => {
    if (option.dataset.service === serviceName) {
      option.classList.add("active");
    } else {
      option.classList.remove("active");
    }
  });
}

function updateServiceFromRepairOption(option) {
  serviceSelect.value = option.dataset.service;
  setActiveRepairOption(option.dataset.service);
  updateSummary();
}

function renderAppointments() {
  const appointments = getAppointments();

  appointmentList.innerHTML = "";

  if (appointments.length === 0) {
    emptyAppointments.classList.remove("d-none");
    return;
  }

  emptyAppointments.classList.add("d-none");

  appointments.forEach((appointment) => {
    const appointmentCard = document.createElement("article");
    appointmentCard.className = "appointment-card";

    appointmentCard.innerHTML = `
      <div>
        <h3>${appointment.service}</h3>
        <p><strong>Customer:</strong> ${appointment.name}</p>
        <p><strong>Issue:</strong> ${appointment.problem || "No issue description provided."}</p>

        <div class="appointment-details">
          <span>${appointment.device}</span>
          <span>${appointment.date}</span>
          <span>${appointment.time}</span>
          <span>${appointment.price}</span>
          <span>${appointment.repairTime}</span>
        </div>
      </div>

      <button class="cancel-appointment" data-id="${appointment.id}">
        Cancel
      </button>
    `;

    appointmentList.appendChild(appointmentCard);
  });
}

function createAppointment() {
  const selectedOption = getSelectedServiceOption();
  const problemDescription = document.getElementById("problemDescription").value.trim();

  return {
    id: crypto.randomUUID(),
    name: nameInput.value.trim(),
    device: deviceSelect.value,
    service: serviceSelect.value,
    price: selectedOption.dataset.price,
    repairTime: selectedOption.dataset.time,
    date: dateInput.value,
    time: timeSelect.value,
    problem: problemDescription
  };
}

function closeConfirmation() {
  confirmationCard.classList.add("d-none");
}

repairOptions.forEach((option) => {
  option.addEventListener("click", () => {
    updateServiceFromRepairOption(option);
  });
});

serviceSelect.addEventListener("change", () => {
  setActiveRepairOption(serviceSelect.value);
  updateSummary();
});

deviceSelect.addEventListener("change", updateSummary);
dateInput.addEventListener("change", updateSummary);
timeSelect.addEventListener("change", updateSummary);

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const customerName = nameInput.value.trim();

  if (!customerName || !dateInput.value || !timeSelect.value) {
    alert("Please enter your name, preferred date, and preferred time before booking.");
    return;
  }

  const newAppointment = createAppointment();
  const appointments = getAppointments();

  appointments.push(newAppointment);
  saveAppointments(appointments);
  renderAppointments();

  confirmationMessage.textContent = `Thanks, ${newAppointment.name}. Your repair appointment has been booked.`;
  confirmService.textContent = newAppointment.service;
  confirmDevice.textContent = newAppointment.device;
  confirmDate.textContent = newAppointment.date;
  confirmTime.textContent = newAppointment.time;

  confirmationCard.classList.remove("d-none");
});

appointmentList.addEventListener("click", (event) => {
  if (!event.target.classList.contains("cancel-appointment")) {
    return;
  }

  const appointmentId = event.target.dataset.id;
  const confirmedCancel = confirm("Cancel this appointment?");

  if (!confirmedCancel) {
    return;
  }

  const updatedAppointments = getAppointments().filter((appointment) => {
    return appointment.id !== appointmentId;
  });

  saveAppointments(updatedAppointments);
  renderAppointments();
});

closeConfirmationButton.addEventListener("click", closeConfirmation);

confirmationCard.addEventListener("click", (event) => {
  if (event.target === confirmationCard) {
    closeConfirmation();
  }
});

resetBookingButton.addEventListener("click", () => {
  bookingForm.reset();

  serviceSelect.value = "Laptop Diagnostic";
  deviceSelect.value = "Laptop";
  setActiveRepairOption("Laptop Diagnostic");
  updateSummary();
  closeConfirmation();

  document.getElementById("booking").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");

mobileMenuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const offcanvasElement = document.getElementById("mobileMenu");
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvasElement);

    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  });
});

updateSummary();
renderAppointments();