
(() => {
  const STORAGE_KEY = "pileeTechServices_v1";

  const initialServices = [
    ["1 Cleaner", "Hourly", "Per hour", 120, 12],
    ["2 Cleaners", "Hourly", "Per hour", 220, 9],
    ["3 Cleaners", "Hourly", "Per hour", 330, 5],
    ["4 Cleaners", "Hourly", "Per hour", 440, 5],
    ["5 Cleaners", "Hourly", "Per hour", 550, 3],
    ["Standard Home Cleaning", "Residential", "Per visit", 350, 28],
    ["Apartment Cleaning", "Residential", "Per visit", 280, 18],
    ["Full House Cleaning", "Residential", "Per visit", 650, 14],
    ["Kitchen Cleaning", "Residential", "Per visit", 220, 11],
    ["Bathroom Cleaning", "Residential", "Per room", 150, 16],
    ["Deep Home Cleaning", "Deep Cleaning", "Per visit", 850, 21],
    ["Move-In Cleaning", "Deep Cleaning", "Per visit", 950, 8],
    ["Move-Out Cleaning", "Deep Cleaning", "Per visit", 1100, 7],
    ["Carpet Cleaning", "Specialist", "Per room", 300, 13],
    ["Window Cleaning", "Specialist", "Per job", 250, 10],
    ["Office Cleaning", "Commercial", "Per visit", 750, 17],
    ["Commercial Deep Cleaning", "Commercial", "Per job", 1450, 4]
  ].map((service, index) => ({
    id: `SRV${String(index + 1).padStart(3, "0")}`,
    name: service[0],
    category: service[1],
    unit: service[2],
    price: service[3],
    bookings: service[4],
    status: "Active",
    description: ""
  }));

  const $ = id => document.getElementById(id);

  let services = loadServices();
  let toastTimer;

  // Load saved services from browser storage.
  function loadServices() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn("Could not load saved services.", error);
    }

    return initialServices.map(service => ({ ...service }));
  }

  // Save services in the current browser.
  function saveServices() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(services)
      );
    } catch (error) {
      showToast("Unable to save changes in this browser.");
    }
  }

  // Format prices in South African rand.
  function money(value) {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
      .format(Number(value) || 0)
      .replace("ZAR", "R")
      .replace(/\u00a0/g, " ");
  }

  // Safely display user-entered text in HTML.
  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  // Update all statistics.
  function updateStats() {
    const active = services.filter(
      service => service.status === "Active"
    ).length;

    const inactive = services.length - active;

    ["totalServices", "miniTotal"].forEach(id => {
      $(id).textContent = services.length;
    });

    ["activeServices", "miniActive"].forEach(id => {
      $(id).textContent = active;
    });

    ["inactiveServices", "miniInactive"].forEach(id => {
      $(id).textContent = inactive;
    });

    $("catalogueCount").textContent =
      `${services.length} ${
        services.length === 1 ? "service" : "services"
      }`;
  }

  // Apply search and filters.
  function getVisibleServices() {
    const query = $("searchInput").value.trim().toLowerCase();
    const category = $("categoryFilter").value;
    const status = $("statusFilter").value;
    const price = $("priceFilter").value;

    return services.filter(service => {
      const searchable = [
        service.name,
        service.id,
        service.category,
        service.unit
      ].join(" ").toLowerCase();

      if (query && !searchable.includes(query)) {
        return false;
      }

      if (category !== "all" && service.category !== category) {
        return false;
      }

      if (status !== "all" && service.status !== status) {
        return false;
      }

      if (price === "under200" && Number(service.price) >= 200) {
        return false;
      }

      if (
        price === "200to500" &&
        (Number(service.price) < 200 ||
         Number(service.price) > 500)
      ) {
        return false;
      }

      if (price === "over500" && Number(service.price) <= 500) {
        return false;
      }

      return true;
    });
  }

  // Display services in the table.
  function renderServices() {
    updateStats();

    const visibleServices = getVisibleServices();

    $("servicesTableBody").innerHTML = visibleServices
      .map(service => `
        <tr>
          <td>
            <div class="service-cell">
              <div class="service-thumb" aria-hidden="true">✧</div>
              <div>
                <div class="service-name">
                  ${escapeHTML(service.name)}
                </div>
                <div class="service-id">
                  ${escapeHTML(service.id)}
                </div>
              </div>
            </div>
          </td>

          <td>${escapeHTML(service.category)}</td>
          <td>${escapeHTML(service.unit)}</td>
          <td>${money(service.price)}</td>

          <td>
            <button class="booking-button" type="button"
                    title="Total bookings">
              ${Number(service.bookings) || 0} total
            </button>
          </td>

          <td>
            <span class="status ${
              service.status === "Inactive" ? "inactive" : ""
            }">
              ${escapeHTML(service.status)}
            </span>
          </td>

          <td>
            <div class="row-actions">
              <button class="action-button edit"
                      data-action="edit"
                      data-id="${escapeHTML(service.id)}"
                      type="button">
                Edit
              </button>

              <button class="action-button"
                      data-action="toggle"
                      data-id="${escapeHTML(service.id)}"
                      type="button">
                ${service.status === "Active"
                  ? "Deactivate"
                  : "Activate"}
              </button>

              <button class="action-button delete"
                      data-action="delete"
                      data-id="${escapeHTML(service.id)}"
                      type="button">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `)
      .join("");

    $("emptyState").hidden = visibleServices.length !== 0;

    $("resultsLabel").textContent =
      `Showing ${visibleServices.length} of ${services.length} services`;
  }

  // Show a temporary notification.
  function showToast(message) {
    const toast = $("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  // Open the add/edit form.
  function openDialog(service = null) {
    $("serviceForm").reset();

    $("serviceId").value = service?.id || "";

    $("dialogTitle").textContent = service
      ? "Edit Service"
      : "Add New Service";

    $("serviceName").value = service?.name || "";
    $("serviceCategory").value = service?.category || "Hourly";
    $("serviceUnit").value = service?.unit || "Per hour";
    $("servicePrice").value = service?.price ?? "";
    $("serviceBookings").value = service?.bookings ?? 0;
    $("serviceStatus").value = service?.status || "Active";
    $("serviceDescription").value = service?.description || "";

    $("serviceDialog").showModal();
  }

  function closeDialog() {
    $("serviceDialog").close();
  }

  // Add a new service.
  $("addServiceBtn").addEventListener("click", () => {
    openDialog();
  });

  $("closeDialogBtn").addEventListener("click", closeDialog);
  $("cancelDialogBtn").addEventListener("click", closeDialog);

  // Save a new service or update an existing service.
  $("serviceForm").addEventListener("submit", event => {
    event.preventDefault();

    const name = $("serviceName").value.trim();
    const price = Number($("servicePrice").value);

    if (!name || !Number.isFinite(price) || price <= 0) {
      showToast("Please enter a service name and a valid price.");
      return;
    }

    const existingId = $("serviceId").value;

    const nextNumber = Math.max(
      0,
      ...services.map(service =>
        Number(String(service.id).replace(/\D/g, "")) || 0
      )
    ) + 1;

    const data = {
      id: existingId || `SRV${String(nextNumber).padStart(3, "0")}`,
      name,
      category: $("serviceCategory").value,
      unit: $("serviceUnit").value,
      price,
      bookings: Math.max(
        0,
        Number($("serviceBookings").value) || 0
      ),
      status: $("serviceStatus").value,
      description: $("serviceDescription").value.trim()
    };

    if (existingId) {
      services = services.map(service =>
        service.id === existingId ? data : service
      );

      showToast("Service updated successfully.");
    } else {
      services.push(data);
      showToast("New service added successfully.");
    }

    saveServices();
    closeDialog();
    renderServices();
  });

  // Handle Edit, Activate/Deactivate, and Delete actions.
  $("servicesTableBody").addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const service = services.find(
      item => item.id === button.dataset.id
    );

    if (!service) return;

    switch (button.dataset.action) {
      case "edit":
        openDialog(service);
        break;

      case "toggle":
        service.status = service.status === "Active"
          ? "Inactive"
          : "Active";

        saveServices();
        renderServices();

        showToast(
          `${service.name} is now ${service.status.toLowerCase()}.`
        );
        break;

      case "delete":
        if (confirm(
          `Delete "${service.name}" (${service.id})? This cannot be undone.`
        )) {
          services = services.filter(
            item => item.id !== service.id
          );

          saveServices();
          renderServices();
          showToast("Service deleted.");
        }
        break;
    }
  });

  // Search as the user types and filter when a selection changes.
  $("searchInput").addEventListener("input", renderServices);

  ["categoryFilter", "statusFilter", "priceFilter"].forEach(id => {
    $(id).addEventListener("change", renderServices);
  });

  // Reset every filter.
  $("resetFiltersBtn").addEventListener("click", () => {
    $("searchInput").value = "";
    $("categoryFilter").value = "all";
    $("statusFilter").value = "all";
    $("priceFilter").value = "all";

    renderServices();
  });

  // Initial page display.
  renderServices();
})();


/* =========================================
   SERVICE CATALOGUE - IMAGE PREVIEW
   ========================================= */

const serviceImageInput = document.getElementById("serviceImage");
const previewImage = document.getElementById("previewImage");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const removeImageButton = document.getElementById("removeServiceImage");
const uploadMessage = document.getElementById("imageUploadMessage");

let serviceImagePreviewUrl = null;

if (serviceImageInput) {
    serviceImageInput.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            showImageMessage("Please select a JPG, PNG or WEBP image.", true);
            this.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showImageMessage("The image must be smaller than 5 MB.", true);
            this.value = "";
            return;
        }

        if (serviceImagePreviewUrl) {
            URL.revokeObjectURL(serviceImagePreviewUrl);
        }

        serviceImagePreviewUrl = URL.createObjectURL(file);

        previewImage.src = serviceImagePreviewUrl;
        previewImage.hidden = false;
        uploadPlaceholder.hidden = true;
        removeImageButton.hidden = false;

        showImageMessage(`Selected: ${file.name}`, false);
    });
}

if (removeImageButton) {
    removeImageButton.addEventListener("click", function () {
        serviceImageInput.value = "";
        previewImage.removeAttribute("src");
        previewImage.hidden = true;
        uploadPlaceholder.hidden = false;
        removeImageButton.hidden = true;

        if (serviceImagePreviewUrl) {
            URL.revokeObjectURL(serviceImagePreviewUrl);
            serviceImagePreviewUrl = null;
        }

        showImageMessage(
            "Choose a clear picture that represents this cleaning service.",
            false
        );
    });
}

function showImageMessage(message, isError) {
    if (!uploadMessage) return;

    uploadMessage.textContent = message;
    uploadMessage.classList.toggle("error", isError);
}

