"use strict";

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const LOGIN_PAGE = "login.html";

const STORAGE_KEY = "pileeCleaningBookings_v1";
const PENDING_KEY = "pileePendingBooking";
const LOGIN_KEY = "pileeLoggedInUser";
const RETURN_TO_PAYMENT_KEY = "pileeReturnToPayment";

const SERVICE_FEE = 30;
const ADMIN_FEE = 49;

const money = amount => "R" + Number(amount || 0).toFixed(2);

function normalizeServiceKey(str) {
    return String(str || "")
        .replace(/^\d+\.\s*/, "")
        .replace(/\bcleaning\b/gi, "")
        .replace(/\s+/g, "")
        .toLowerCase()
        .trim();
}

const services = {
    Indoor: {
        "Indoor Cleaning": {
            id: 1,
            base: 120,
            guide: "R120.00 per hour · Minimum 3 hours",
            hourly: true,
            extras: [
                ["Ironing", 120, "basket"],
                ["Interior walls", 200],
                ["Inside cabinets", 180],
                ["Inside fridge", 100],
                ["Inside oven", 150],
                ["Interior windows", 35, "window"],
                ["Laundry", 180]
            ]
        },
        "Deep House Cleaning": {
            id: 2,
            base: 300,
            guide: "Starting at R300.00",
            bedrooms: true,
            extras: [
                ["Inside kitchen cupboards (empty)", 180],
                ["Inside fridge", 100],
                ["Inside oven", 150],
                ["Skirting boards and detailed edges", 120],
                ["Interior windows", 35, "window"],
                ["Mattress vacuuming", 80, "mattress"],
                ["Sofa vacuuming", 100, "sofa"]
            ]
        },
        "Apartment Cleaning": {
            id: 3,
            base: 150,
            guide: "R150.00 includes 1 bedroom and 1 bathroom",
            apartment: true,
            extras: [
                ["Inside fridge", 100],
                ["Inside oven", 150],
                ["Balcony sweep and mop", 80],
                ["Interior windows", 35, "window"],
                ["Change bed linen", 40, "bed"]
            ]
        },
        "Office Cleaning": {
            id: 4,
            base: 150,
            guide: "R150.00 includes 2 offices or rooms",
            offices: true,
            extras: [
                ["Meeting room", 100],
                ["Kitchenette clean", 120],
                ["Interior glass partitions", 25, "panel"],
                ["Bin emptying and liner replacement", 50],
                ["After-hours service", null, null, "Quote"],
                ["Weekly/monthly contract", null, null, "Quote"]
            ]
        },
        "Move-In Cleaning": {
            id: 5,
            base: 250,
            guide: "Starting at R250.00",
            bedrooms: true,
            extras: [
                ["Inside kitchen cupboards (empty)", 180],
                ["Inside fridge", 100],
                ["Inside oven", 150],
                ["Interior windows", 20, "window"],
                ["Balcony/patio", 100, null, "From"],
                ["Garage sweep", 150, null, "From"],
                ["Wall spot-cleaning", 120, null, "From"]
            ]
        },
        "Move-Out Cleaning": {
            id: 6,
            base: 300,
            guide: "Starting at R300.00",
            bedrooms: true,
            extras: [
                ["Inside kitchen cupboards (empty)", 180],
                ["Inside fridge", 100],
                ["Inside oven", 150],
                ["Interior windows", 35, "window"],
                ["Balcony/patio", 100, null, "From"],
                ["Garage sweep", 150, null, "From"],
                ["Heavy grease or limescale treatment", null, null, "Quote"]
            ]
        },
        "Laundry Services": {
            id: 8,
            base: 90,
            guide: "R90.00 per load",
            laundry: true,
            extras: [
                ["Wash and fold", 80, "load", "From"],
                ["Ironing", 60, "basket", "From"],
                ["Bedding wash", 100, "load"]
            ]
        },
        "Airbnb Cleaning": {
            id: 10,
            base: 150,
            guide: "Starting at R150.00",
            bedrooms: true,
            extras: [
                ["Change bed linen", 40, "bed"],
                ["Laundry and towel refresh", 80, "load", "From"],
                ["Restock checklist", 50],
                ["Fridge clean", 100],
                ["Oven clean", 150],
                ["Interior windows", 35, "window"],
                ["Urgent/same-day turnover", 150, null, "From"]
            ]
        }
    },
    Outdoor: {
        "Outdoor Cleaning": {
            id: 7,
            base: 140,
            guide: "Starting at R140.00",
            extras: [
                ["Balcony clean", 80, null, "From"],
                ["Patio sweep and mop", 100, null, "From"],
                ["Garage sweep", 150, null, "From"],
                ["Driveway sweep", 120, null, "From"],
                ["Bin wash", 50, "bin"],
                ["Car washing", 110, null, "From"],
                ["Outdoor windows", 25, "window"]
            ]
        },
        "Car Wash": {
            id: 9,
            base: 100,
            guide: "Choose a vehicle type",
            vehicle: true,
            extras: [
                ["Interior vacuum", 50],
                ["Dashboard and console wipe", 40],
                ["Tyre shine", 30],
                ["Seat cleaning", 150, null, "From"],
                ["Boot vacuum", 30]
            ]
        }
    }
};

async function syncServicesFromDatabase() {
    try {
        const res = await fetch("services-api.php");
        const dbList = await res.json();
        if (!Array.isArray(dbList)) return;

        const activeNormalized = new Set();

        dbList.forEach(item => {
            if (item.status !== "Active") return;
            const cleanName = String(item.name || "").replace(/^\d+\.\s*/, "").trim();
            const normDb = normalizeServiceKey(cleanName);
            const isOutdoor = /outdoor|car\s*wash|exterior|patio|driveway/i.test(cleanName);
            const bucket = isOutdoor ? services.Outdoor : services.Indoor;

            const existingKey = Object.keys(bucket).find(k =>
                k.toLowerCase() === cleanName.toLowerCase() || normalizeServiceKey(k) === normDb
            );
            const unitLabel = item.unit ? `/ ${item.unit}` : "/ Per visit";

            if (existingKey) {
                const template = bucket[existingKey];
                delete bucket[existingKey];
                template.id = Number(item.id);
                template.base = Number(item.price);
                template.hourly = item.pricing_type === "hourly_team_rate";
                template.guide = `${cleanName}: From ${money(item.price)} ${unitLabel}`;
                bucket[cleanName] = template;
                activeNormalized.add(normDb);
            } else {
                bucket[cleanName] = {
                    id: Number(item.id),
                    base: Number(item.price),
                    guide: `${cleanName}: From ${money(item.price)} ${unitLabel}`,
                    hourly: item.pricing_type === "hourly_team_rate",
                    extras: [
                        ["Interior windows", 35, "window"],
                        ["Inside fridge", 100],
                        ["Inside oven", 150]
                    ]
                };
                activeNormalized.add(normDb);
            }
        });

        ["Indoor", "Outdoor"].forEach(areaKey => {
            Object.keys(services[areaKey]).forEach(srvName => {
                const normLocal = normalizeServiceKey(srvName);
                const existsInDb = dbList.some(d => normalizeServiceKey(d.name) === normLocal);
                if (existsInDb && !activeNormalized.has(normLocal)) {
                    delete services[areaKey][srvName];
                }
            });
        });
    } catch (err) {
        console.warn("Could not sync live service prices:", err);
    }
}

const cleaners = [
    {
        id: "c1",
        name: "Thandi Mokoena",
        province: "Gauteng",
        rating: "4.9",
        skills: "Deep cleaning · Offices",
        image: ""
    },
    {
        id: "c2",
        name: "Lerato Nkosi",
        province: "Gauteng",
        rating: "4.8",
        skills: "Apartments · Airbnb · Laundry",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160"
    },
    {
        id: "c3",
        name: "Nomsa Dlamini",
        province: "Gauteng",
        rating: "4.9",
        skills: "Move-in/out · Windows · Deep cleaning",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160"
    },
    {
        id: "c4",
        name: "Ayanda Khumalo",
        province: "Gauteng",
        rating: "4.7",
        skills: "Office · Outdoor · General cleaning",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160"
    },
    {
        id: "c5",
        name: "Amara Jacobs",
        province: "Western Cape",
        rating: "4.8",
        skills: "Residential · Deep cleaning",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160"
    },
    {
        id: "c6",
        name: "Zanele Mthembu",
        province: "KwaZulu-Natal",
        rating: "4.9",
        skills: "Residential · Office cleaning",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160"
    }
];

const locations = [
    { name: "Eduvos Midrand Campus", street: "Eduvos Midrand Campus", city: "Midrand", province: "Gauteng", postal: "1685" },
    { name: "Eduvos Pretoria Campus", street: "Eduvos Pretoria Campus", city: "Pretoria", province: "Gauteng", postal: "0002" },
    { name: "Eduvos Bedfordview Campus", street: "Eduvos Bedfordview Campus", city: "Bedfordview", province: "Gauteng", postal: "2007" },
    { name: "Eduvos Durban Campus", street: "Eduvos Durban Campus", city: "Durban", province: "KwaZulu-Natal", postal: "4001" },
    { name: "Eduvos Cape Town Campus", street: "Eduvos Cape Town Campus", city: "Cape Town", province: "Western Cape", postal: "8001" },
    { name: "Sandton City", street: "Sandton City", city: "Sandton", province: "Gauteng", postal: "2196" },
    { name: "Mall of the North", street: "Mall of the North", city: "Polokwane", province: "Limpopo", postal: "0699" }
];

const state = {
    area: "",
    service: "",
    serviceId: 0,
    frequency: "One-time",
    days: [],
    dailyCount: 1,
    weekCount: 4,
    startDate: "",
    startTime: "",
    hours: 3,
    bedrooms: 1,
    bathrooms: 1,
    offices: 2,
    loads: 1,
    vehicle: "Hatch/Sedan",
    extras: {},
    extraQuantities: {},
    cleanerCount: 0,
    selectedCleaners: [],
    pets: "No",
    address: {
        street: "14 Jacaranda Street",
        building: "",
        city: "Johannesburg",
        province: "Gauteng",
        postal: "2006"
    },
    total: SERVICE_FEE + ADMIN_FEE,
    breakdown: []
};

function serviceData() {
    if (!state.area || !state.service) return null;
    return services[state.area]?.[state.service] || null;
}

function getLoggedInUser() {
    try {
        return JSON.parse(localStorage.getItem(LOGIN_KEY));
    } catch {
        return null;
    }
}

function loadCustomerDetails() {
    const user = getLoggedInUser();
    if (!user) return;
    $("#customerName").value = user.name || user.firstName || "";
    $("#customerSurname").value = user.surname || user.lastName || "";
    $("#customerEmail").value = user.email || "";
}

function getLocalDate(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getToday() {
    return getLocalDate();
}

function setTodayMinimum() {
    const input = $("#startDate");
    input.min = getToday();
    input.value = "";
    state.startDate = "";
    state.startTime = "";
    setupTimes();
}

function setupTimes() {
    const select = $("#startTime");
    const previousTime = state.startTime;
    select.innerHTML = "";

    const selectedDate = $("#startDate").value;
    const today = getToday();

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a date first";
    select.append(placeholder);

    if (!selectedDate) {
        select.disabled = true;
        state.startTime = "";
        return;
    }

    if (selectedDate < today) {
        select.disabled = true;
        placeholder.textContent = "Please select a valid date";
        state.startTime = "";
        return;
    }

    select.disabled = false;
    placeholder.textContent = "Select an available time";
    const now = new Date();

    for (let hour = 7; hour <= 18; hour++) {
        for (const minute of [0, 30]) {
            if (hour === 18 && minute === 30) continue;
            const time = String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");
            if (selectedDate === today) {
                const appointment = new Date(`${selectedDate}T${time}:00`);
                if (appointment <= now) continue;
            }
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            select.append(option);
        }
    }

    if (select.options.length === 1) {
        select.disabled = true;
        placeholder.textContent = "No available times for this date";
        state.startTime = "";
        return;
    }

    const timeExists = [...select.options].some(option => option.value === previousTime);
    if (timeExists) {
        select.value = previousTime;
        state.startTime = previousTime;
    } else {
        select.value = "";
        state.startTime = "";
    }

    updateHourLimit();
}

function changeFrequency(value) {
    const validFrequencies = ["One-time", "Daily", "Weekly", "Bi-weekly", "Monthly"];
    if (!validFrequencies.includes(value)) return;

    state.frequency = value;
    state.days = [];
    state.dailyCount = 1;
    state.weekCount = 4;

    $$("#frequencyOptions .frequency-option").forEach(button => {
        button.classList.toggle("active", button.dataset.value === value);
    });

    $$("#dayOptions .day-option").forEach(button => {
        button.classList.remove("active");
    });

    const isOneTime = value === "One-time";
    $("#recurringOptions").classList.toggle("hidden", isOneTime);
    $("#frequencyNotice").classList.toggle("hidden", !isOneTime);
    $("#dailyCountWrap").classList.toggle("hidden", value !== "Daily");

    const descriptions = {
        "One-time": "Your service will take place once on your selected date.",
        "Daily": "Choose the days of the week on which you need cleaning.",
        "Weekly": "Choose one day for your weekly cleaning service.",
        "Bi-weekly": "Choose one day. Your service will repeat every two weeks.",
        "Monthly": "Choose one preferred weekday for your monthly service."
    };
    $("#frequencyDescription").textContent = descriptions[value];

    const hints = {
        "Daily": "Choose the number of days you selected above.",
        "Weekly": "Choose exactly one day.",
        "Bi-weekly": "Choose exactly one day.",
        "Monthly": "Choose exactly one day."
    };
    $("#dayHint").textContent = hints[value] || "";

    $("#durationHint").textContent = value === "Monthly"
        ? "Number of months for this recurring schedule."
        : "Number of weeks for this recurring schedule.";

    $("#dailyCountValue").textContent = state.dailyCount;
    $("#weekCountValue").textContent = state.weekCount;
    updateAll();
}

function selectPreferredDay(button) {
    if (state.frequency === "One-time") return;
    const day = button.dataset.value;
    const alreadySelected = state.days.includes(day);

    if (alreadySelected) {
        state.days = state.days.filter(selectedDay => selectedDay !== day);
    } else {
        if (state.frequency === "Daily") {
            if (state.days.length >= state.dailyCount) {
                alert(`You can select only ${state.dailyCount} day(s).`);
                return;
            }
        } else if (state.days.length >= 1) {
            alert("Please select only one preferred day.");
            return;
        }
        state.days.push(day);
    }

    $$("#dayOptions .day-option").forEach(item => {
        item.classList.toggle("active", state.days.includes(item.dataset.value));
    });
    updateAll();
}

function handleFrequencyStepper(key, delta) {
    if (key === "dailyCount") {
        state.dailyCount = Math.min(6, Math.max(1, state.dailyCount + delta));
        state.days = state.days.slice(0, state.dailyCount);
        $("#dailyCountValue").textContent = state.dailyCount;
        $$("#dayOptions .day-option").forEach(button => {
            button.classList.toggle("active", state.days.includes(button.dataset.value));
        });
    }

    if (key === "weekCount") {
        const maximum = state.frequency === "Monthly" ? 12 : 26;
        state.weekCount = Math.min(maximum, Math.max(1, state.weekCount + delta));
        $("#weekCountValue").textContent = state.weekCount;
    }

    updateAll();
}

function validateFrequency() {
    if (!$("#startDate").value) {
        alert("Please select a start date.");
        $("#startDate").focus();
        return false;
    }

    if ($("#startDate").value < getToday()) {
        alert("Please select today or a future date.");
        return false;
    }

    if (state.frequency === "One-time") return true;

    if (state.frequency === "Daily") {
        if (state.days.length !== state.dailyCount) {
            alert(`Please select exactly ${state.dailyCount} preferred day(s).`);
            return false;
        }
    } else if (state.days.length !== 1) {
        alert("Please select exactly one preferred day.");
        return false;
    }

    const start = new Date($("#startDate").value + "T12:00:00");
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][start.getDay()];

    if (!state.days.includes(weekday)) {
        alert(`Your start date falls on ${weekday}. Please select ${weekday} as a preferred day or choose a different date.`);
        return false;
    }

    return true;
}

function updateHourLimit() {
    const hour = Number((state.startTime || "07:00").slice(0, 2));
    const max = hour >= 16 ? 5 : 8;
    state.hours = Math.min(Math.max(3, state.hours), max);
    $("#hoursValue").textContent = state.hours;
    $("#hoursHint").textContent = `Minimum 3 · Maximum ${max} hours`;
}

function renderServiceOptions() {
    const select = $("#serviceType");
    select.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = state.area
        ? "Select a cleaning service"
        : "Select a service area first";
    select.append(placeholder);

    if (!state.area || !services[state.area]) {
        select.disabled = true;
        state.service = "";
        state.serviceId = 0;
        $("#priceGuide").textContent = "Select a service area to view available services.";
        $("#serviceQuantities").innerHTML = "";
        $("#additionalServices").innerHTML = "";
        $("#extraCount").textContent = "0 / 6 selected";
        $("#vehicleWrap").classList.add("hidden");
        updateAll();
        return;
    }

    select.disabled = false;
    Object.keys(services[state.area]).forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.append(option);
    });

    select.value = state.service || "";
    renderServiceFields();
}

function addQuantityControl(label, key, min, max) {
    const wrap = document.createElement("div");
    wrap.className = "field";

    const title = document.createElement("span");
    title.textContent = label;

    const step = document.createElement("div");
    step.className = "stepper";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";

    const output = document.createElement("output");
    output.textContent = state[key];

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";

    minus.addEventListener("click", () => {
        state[key] = Math.max(min, state[key] - 1);
        output.textContent = state[key];
        updateAll();
    });

    plus.addEventListener("click", () => {
        state[key] = Math.min(max, state[key] + 1);
        output.textContent = state[key];
        updateAll();
    });

    step.append(minus, output, plus);
    wrap.append(title, step);
    $("#serviceQuantities").append(wrap);
}

function renderServiceFields() {
    const data = serviceData();
    $("#serviceQuantities").innerHTML = "";
    $("#additionalServices").innerHTML = "";
    $("#vehicleWrap").classList.toggle("hidden", !data || !data.vehicle);

    if (!data) {
        $("#priceGuide").textContent = "Select a service to view pricing.";
        $("#extraCount").textContent = "0 / 6 selected";
        updateAll();
        return;
    }

    state.serviceId = data.id || 0;
    $("#priceGuide").textContent = data.guide;

    if (data.bedrooms || data.apartment) {
        addQuantityControl("Bedrooms", "bedrooms", 1, 20);
        addQuantityControl("Bathrooms", "bathrooms", 1, 20);
    }

    if (data.offices) {
        addQuantityControl("Number of offices / rooms", "offices", 2, 100);
    }

    if (data.laundry) {
        addQuantityControl("Loads / baskets", "loads", 1, 30);
    }

    $("#vehicleType").value = state.vehicle;
    renderExtras();
    updateAll();
}

const additionalIcons = [
    "🧺", "🧱", "🗄️", "🧊", "♨️",
    "🪟", "🧼", "🍽️", "🛏️", "🛋️",
    "🚪", "🧹", "🚗", "🪣"
];

function renderExtras() {
    const container = $("#additionalServices");
    container.innerHTML = "";
    const data = serviceData();

    if (!data) {
        $("#extraCount").textContent = "0 / 6 selected";
        return;
    }

    data.extras.forEach(([name, price, unit, tag], index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "extra-card" + (state.extras[name] ? " selected" : "");

        const icon = document.createElement("span");
        icon.className = "extra-icon";
        icon.textContent = additionalIcons[index % additionalIcons.length];

        const info = document.createElement("span");
        info.className = "extra-info";

        const title = document.createElement("strong");
        title.textContent = name;

        const detail = document.createElement("small");
        detail.textContent = price === null
            ? (tag || "Quote")
            : `${tag === "From" ? "From " : ""}${money(price)}${unit ? " / " + unit : ""}`;

        info.append(title, detail);

        const check = document.createElement("span");
        check.className = "extra-check";
        check.textContent = state.extras[name] ? "✓" : "";

        button.append(icon, info, check);

        button.addEventListener("click", () => {
            const count = Object.values(state.extras).filter(Boolean).length;
            if (!state.extras[name] && count >= 6) {
                alert("You can select up to six additional services.");
                return;
            }
            state.extras[name] = !state.extras[name];
            if (state.extras[name] && unit) {
                state.extraQuantities[name] = 1;
            }
            if (!state.extras[name]) {
                delete state.extraQuantities[name];
            }
            renderExtras();
            updateAll();
        });

        container.append(button);

        if (state.extras[name] && unit) {
            const quantity = document.createElement("div");
            quantity.className = "field";

            const label = document.createElement("span");
            label.textContent = `${name} quantity (${unit})`;

            const input = document.createElement("input");
            input.type = "number";
            input.min = 1;
            input.max = 50;
            input.value = state.extraQuantities[name] || 1;

            input.addEventListener("change", () => {
                state.extraQuantities[name] = Math.min(50, Math.max(1, Number(input.value) || 1));
                input.value = state.extraQuantities[name];
                updateAll();
            });

            quantity.append(label, input);
            container.append(quantity);
        }
    });

    $("#extraCount").textContent = `${Object.values(state.extras).filter(Boolean).length} / 6 selected`;
}

function calculatePrice() {
    const rows = [];
    let total = 0;

    function add(label, amount) {
        if (amount > 0) {
            rows.push({ label, amount });
            total += amount;
        }
    }

    add("Service fee", SERVICE_FEE);
    add("Admin fee", ADMIN_FEE);

    const data = serviceData();
    if (!data) {
        return { rows, total };
    }

    const baseRate = Number(data.base) || 0;

    if (data.hourly) {
        const hourlyRate = baseRate > 0 ? baseRate : 120;
        add(`${state.service} (${state.hours} hours @ ${money(hourlyRate)}/hr)`, state.hours * hourlyRate);
    } else if (data.apartment) {
        const aptBase = baseRate > 0 ? baseRate : 150;
        add("Apartment cleaning base", aptBase);
        add("Extra bedrooms", Math.max(0, state.bedrooms - 1) * 60);
        add("Extra bathrooms", Math.max(0, state.bathrooms - 1) * 80);
    } else if (data.offices) {
        const offBase = baseRate > 0 ? baseRate : 150;
        add("Office cleaning base", offBase);
        add("Additional rooms", Math.max(0, state.offices - 2) * 80);
    } else if (data.laundry) {
        const loadRate = baseRate > 0 ? baseRate : 90;
        add(`Laundry loads (${state.loads})`, loadRate * state.loads);
    } else if (data.vehicle) {
        const vehiclePrices = {
            "Hatch/Sedan": 200,
            "SUV": 120,
            "Truck": 220,
            "Bus": 250
        };
        add("Car wash — " + state.vehicle, vehiclePrices[state.vehicle]);
    } else {
        add(state.service + " base", baseRate);
    }

    if (data.bedrooms && !data.apartment) {
        let fee = 0;
        if (state.bedrooms >= 5) fee = 180;
        else if (state.bedrooms >= 3) fee = 120;
        add(`Bedroom band (${state.bedrooms} bedrooms)`, fee);
    }

    if (!data.hourly && state.hours > 3) {
        add("Extra hours", (state.hours - 3) * 120);
    }

    data.extras.forEach(([name, price, unit]) => {
        if (!state.extras[name]) return;
        if (price === null) {
            rows.push({ label: name, quote: true });
            return;
        }
        const quantity = unit ? (state.extraQuantities[name] || 1) : 1;
        add(name, price * quantity);
    });

    return { rows, total };
}

function summaryLine(label, value) {
    const row = document.createElement("div");
    row.className = "summary-line";
    const title = document.createElement("span");
    title.textContent = label;
    const content = document.createElement("strong");
    content.textContent = value || "—";
    row.append(title, content);
    return row;
}

function getAddressText() {
    return [
        state.address.street,
        state.address.building,
        state.address.city,
        state.address.province,
        state.address.postal
    ].filter(Boolean).join(", ");
}

function getRoomInfo() {
    const data = serviceData();
    if (!data) return "Not selected";
    if (data.bedrooms || data.apartment) return `${state.bedrooms} bed · ${state.bathrooms} bath`;
    if (data.offices) return `${state.offices} rooms`;
    if (data.laundry) return `${state.loads} loads`;
    if (data.vehicle) return state.vehicle;
    return "Not applicable";
}

function getCleanerNames() {
    if (state.cleanerCount === 0) return "Pilee to assign";
    return state.selectedCleaners
        .map(id => cleaners.find(c => c.id === id)?.name)
        .filter(Boolean)
        .join(", ") || "No cleaners selected";
}

function renderSummary() {
    const details = $("#summaryDetails");
    details.innerHTML = "";

    const rows = [
        ["Customer", `${$("#customerName").value} ${$("#customerSurname").value}`.trim()],
        ["Email", $("#customerEmail").value],
        ["Location", getAddressText()],
        ["Frequency", state.frequency],
        ["Preferred days", state.frequency === "One-time" ? "Not applicable" : state.days.join(", ") || "Not selected"],
        ["Schedule duration", state.frequency === "One-time" ? "Once-off" : state.frequency === "Monthly" ? `${state.weekCount} months` : `${state.weekCount} weeks`],
        ["Service", state.service ? state.area + " · " + state.service : "Not selected"],
        ["Rooms / loads", getRoomInfo()],
        ["Date & time", ($("#startDate").value || "Not selected") + " · " + (state.startTime || "Not selected")],
        ["Duration", state.hours + " hours"],
        ["Cleaners", getCleanerNames()],
        ["Pets", state.pets]
    ];

    rows.forEach(([label, value]) => {
        details.append(summaryLine(label, value));
    });

    const breakdown = $("#priceBreakdown");
    breakdown.innerHTML = "";

    state.breakdown.forEach(item => {
        const row = document.createElement("div");
        row.className = "price-row" + (item.quote ? " quote" : "");
        const name = document.createElement("span");
        name.textContent = item.label;
        const amount = document.createElement("strong");
        amount.textContent = item.quote ? "Quote" : money(item.amount);
        row.append(name, amount);
        breakdown.append(row);
    });

    $("#summaryTotal").textContent = money(state.total);
}

function updateAll() {
    const result = calculatePrice();
    state.total = result.total;
    state.breakdown = result.rows;
    renderSummary();
}

function renderCleaners() {
    const container = $("#cleanerCards");
    container.innerHTML = "";

    const matches = cleaners.filter(cleaner => cleaner.province === state.address.province);
    if (!matches.length) {
        container.textContent = "No cleaners are currently listed for this province.";
        return;
    }

    if (state.cleanerCount === 0) {
        const assignmentNotice = document.createElement("p");
        assignmentNotice.className = "cleaner-progress";
        assignmentNotice.textContent = "No preferred cleaners selected. Pilee will assign your cleaning team.";
        container.append(assignmentNotice);
    } else {
        const progress = document.createElement("p");
        progress.className = "cleaner-progress";
        progress.textContent = `${state.selectedCleaners.length} of ${state.cleanerCount} cleaners selected`;
        container.append(progress);
    }

    matches.forEach(cleaner => {
        const selected = state.selectedCleaners.includes(cleaner.id);
        const unavailable = !selected && state.selectedCleaners.length >= state.cleanerCount;

        const card = document.createElement("article");
        card.className = "cleaner-card";
        if (selected) card.classList.add("selected-cleaner");
        if (unavailable) card.classList.add("cleaner-disabled");

        const img = document.createElement("img");
        img.className = "cleaner-avatar";
        img.alt = cleaner.name;
        img.src = cleaner.image || "images/default-cleaner.png";
        img.onerror = function () { this.style.display = "none"; };

        const info = document.createElement("div");
        const name = document.createElement("div");
        name.className = "cleaner-name";
        name.textContent = cleaner.name;

        const rating = document.createElement("div");
        rating.className = "cleaner-rating";
        rating.textContent = "★ " + cleaner.rating + " / 5";

        const skills = document.createElement("div");
        skills.className = "cleaner-skills";
        skills.textContent = cleaner.skills;

        info.append(name, rating, skills);

        const actions = document.createElement("div");
        actions.className = "cleaner-actions";

        const view = document.createElement("button");
        view.type = "button";
        view.className = "btn btn-outline";
        view.textContent = "View profile";
        view.addEventListener("click", () => openProfile(cleaner));

        const choose = document.createElement("button");
        choose.type = "button";
        choose.className = "btn btn-primary choose-btn";
        choose.textContent = selected ? "✓ Selected" : "Choose";
        if (selected) choose.classList.add("chosen");
        choose.disabled = unavailable;

        choose.addEventListener("click", () => {
            if (selected) {
                state.selectedCleaners = state.selectedCleaners.filter(id => id !== cleaner.id);
            } else if (state.selectedCleaners.length < state.cleanerCount) {
                state.selectedCleaners.push(cleaner.id);
            }
            renderCleaners();
            updateAll();
        });

        actions.append(view, choose);
        card.append(img, info, actions);
        container.append(card);
    });
}

function openProfile(cleaner) {
    const content = $("#profileContent");
    content.innerHTML = "";

    const head = document.createElement("div");
    head.className = "profile-head";

    const image = document.createElement("img");
    image.src = cleaner.image || "images/default-cleaner.png";
    image.alt = cleaner.name;
    image.style.width = "65px";
    image.style.height = "65px";
    image.style.objectFit = "cover";

    const info = document.createElement("div");
    const name = document.createElement("h2");
    name.textContent = cleaner.name;

    const rating = document.createElement("p");
    rating.textContent = `★ ${cleaner.rating} · ${cleaner.province}`;

    info.append(name, rating);
    head.append(image, info);

    const details = document.createElement("p");
    details.textContent = "Skills: " + cleaner.skills;

    content.append(head, details);
    $("#profileModal").classList.remove("hidden");
}

function showSuggestions(query) {
    const list = $("#suggestions");
    list.innerHTML = "";
    if (!query.trim()) {
        list.classList.add("hidden");
        return;
    }

    const matches = locations.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
    matches.forEach(item => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "suggestion-item";
        button.textContent = item.name + " · " + item.city;
        button.addEventListener("click", () => updateAddressFromSuggestion(item));
        list.append(button);
    });

    if (!matches.length) {
        const message = document.createElement("div");
        message.className = "suggestion-item";
        message.textContent = "No demo match. Enter your address manually.";
        list.append(message);
    }

    list.classList.remove("hidden");
}

function updateAddressFromSuggestion(item) {
    const previousProvince = state.address.province;
    state.address = {
        street: item.street,
        building: "",
        city: item.city,
        province: item.province,
        postal: item.postal
    };

    $("#street").value = item.street;
    $("#city").value = item.city;
    $("#province").value = item.province;
    $("#postalCode").value = item.postal;
    $("#building").value = "";
    $("#addressSearch").value = item.name;
    $("#suggestions").classList.add("hidden");

    if (previousProvince !== item.province) {
        state.selectedCleaners = [];
    }

    renderCleaners();
    updateAll();
}

function validateAddress() {
    const choice = $('input[name="locationChoice"]:checked')?.value;
    if (choice !== "different") return true;

    if (!$("#street").value.trim() || !$("#city").value.trim() || !$("#province").value || !$("#postalCode").value.trim()) {
        alert("Please complete your address details.");
        return false;
    }

    state.address = {
        street: $("#street").value.trim(),
        building: $("#building").value.trim(),
        city: $("#city").value.trim(),
        province: $("#province").value,
        postal: $("#postalCode").value.trim()
    };

    return true;
}

function validateBooking() {
    if (!validateAddress()) return false;

    if (!state.area || !state.service) {
        alert("Please select a service area and cleaning service.");
        $("#areaOptions").scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
    }

    if (!validateFrequency()) return false;

    const selectedDate = $("#startDate").value;
    if (!selectedDate) {
        alert("Please select your cleaning date.");
        $("#startDate").focus();
        return false;
    }

    if (selectedDate < getToday()) {
        alert("You cannot book a date in the past.");
        return false;
    }

    if (!$("#startTime").value || !state.startTime) {
        alert("Please select an available appointment time.");
        $("#startTime").focus();
        return false;
    }

    if (selectedDate === getToday()) {
        const appointment = new Date(`${selectedDate}T${state.startTime}:00`);
        if (appointment <= new Date()) {
            alert("This appointment time has already passed. Please select another time.");
            state.startTime = "";
            setupTimes();
            return false;
        }
    }

    if (state.cleanerCount > 0 && state.selectedCleaners.length !== state.cleanerCount) {
        alert(`Please select ${state.cleanerCount} cleaner(s) before proceeding to payment.`);
        $("#cleanerCards").scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
    }

    if (state.pets === "Yes" && !$("#petDetails").value.trim()) {
        alert("Please add your pet details.");
        return false;
    }

    return true;
}

function collectBookingDraft() {
    return {
        customerName: $("#customerName").value,
        customerSurname: $("#customerSurname").value,
        customerEmail: $("#customerEmail").value,
        state: JSON.parse(JSON.stringify(state)),
        form: {
            petDetails: $("#petDetails").value,
            instructions: $("#instructions").value,
            locationChoice: $('input[name="locationChoice"]:checked')?.value || "saved",
            street: $("#street").value,
            building: $("#building").value,
            city: $("#city").value,
            province: $("#province").value,
            postalCode: $("#postalCode").value
        }
    };
}

function savePendingBooking() {
    localStorage.setItem(PENDING_KEY, JSON.stringify(collectBookingDraft()));
}

function restorePendingBooking() {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return false;

    try {
        const draft = JSON.parse(raw);
        $("#customerName").value = draft.customerName || "";
        $("#customerSurname").value = draft.customerSurname || "";
        $("#customerEmail").value = draft.customerEmail || "";

        if (draft.state) {
            Object.assign(state, draft.state);
        }

        state.days = Array.isArray(state.days) ? state.days : [];
        state.selectedCleaners = Array.isArray(state.selectedCleaners) ? state.selectedCleaners : [];
        state.extras = state.extras || {};
        state.extraQuantities = state.extraQuantities || {};
        state.cleanerCount = Math.min(4, Math.max(0, Number(state.cleanerCount) || 0));

        const form = draft.form || {};
        $("#petDetails").value = form.petDetails || "";
        $("#instructions").value = form.instructions || "";
        $("#street").value = form.street || "";
        $("#building").value = form.building || "";
        $("#city").value = form.city || "";
        $("#province").value = form.province || "";
        $("#postalCode").value = form.postalCode || "";

        const locationRadio = $(`input[name="locationChoice"][value="${form.locationChoice || "saved"}"]`);
        if (locationRadio) locationRadio.checked = true;

        $("#locationFields").classList.toggle("hidden", form.locationChoice !== "different");
        $("#savedAddress").classList.toggle("hidden", form.locationChoice === "different");

        $$("#areaOptions .pill").forEach(button => {
            button.classList.toggle("active", button.dataset.value === state.area);
        });

        renderServiceOptions();
        if (state.service) {
            $("#serviceType").value = state.service;
            renderServiceFields();
        }

        renderCleaners();
        changeFrequency(state.frequency);

        $("#dailyCountValue").textContent = state.dailyCount;
        $("#weekCountValue").textContent = state.weekCount;

        $$("#dayOptions .day-option").forEach(button => {
            button.classList.toggle("active", state.days.includes(button.dataset.value));
        });

        $("#startDate").min = getToday();
        $("#startDate").value = state.startDate || "";
        setupTimes();

        $("#hoursValue").textContent = state.hours;
        $("#cleanerCountValue").textContent = state.cleanerCount;

        $$("#petOptions .pill").forEach(button => {
            button.classList.toggle("active", button.dataset.value === state.pets);
        });
        $("#petDetailsWrap").classList.toggle("hidden", state.pets !== "Yes");

        updateAll();
        return true;
    } catch (error) {
        console.error("Could not restore booking:", error);
        return false;
    }
}

function isCustomerLoggedIn() {
    const user = getLoggedInUser();
    return Boolean(user && user.email);
}

function redirectToLoginBeforePayment() {
    savePendingBooking();
    localStorage.setItem(RETURN_TO_PAYMENT_KEY, "true");
    window.location.href = LOGIN_PAGE + "?return=booking.html&continuePayment=true";
}

function openPaymentModal() {
    $("#paymentAmount").textContent = money(state.total);
    $("#paymentModal").classList.remove("hidden");
}

function openPayment() {
    if (!validateBooking()) return;
    if (!isCustomerLoggedIn()) {
        redirectToLoginBeforePayment();
        return;
    }
    loadCustomerDetails();
    updateAll();
    openPaymentModal();
}

function renderPaidSummary() {
    $("#paidSummaryDetails").innerHTML = $("#summaryDetails").innerHTML;
    $("#paidPriceBreakdown").innerHTML = $("#priceBreakdown").innerHTML;
    $("#paidSummaryTotal").textContent = money(state.total);
}

async function completePayment() {
    if (!isCustomerLoggedIn()) {
        alert("Please sign in before making a payment.");
        $("#paymentModal").classList.add("hidden");
        redirectToLoginBeforePayment();
        return;
    }

    if (!validateBooking()) {
        $("#paymentModal").classList.add("hidden");
        return;
    }

    $("#paymentModal").classList.add("hidden");

    const reference = "PILEE-" + Math.random().toString(10).slice(2, 8);
    const user = getLoggedInUser();

    const booking = {
        reference,
        customer_id: user?.customer_id || 0,
        service_id: state.serviceId || serviceData()?.id || 0,
        customer: {
            name: $("#customerName").value,
            surname: $("#customerSurname").value,
            email: $("#customerEmail").value
        },
        address: { ...state.address },
        frequency: state.frequency,
        preferredDays: [...state.days],
        dailyCount: state.dailyCount,
        scheduleDuration: state.weekCount,
        serviceArea: state.area,
        service: state.service,
        date: state.startDate,
        time: state.startTime,
        duration: state.hours,
        cleanerCount: state.cleanerCount,
        cleanerAssignment: state.cleanerCount === 0 ? "Pilee to assign" : "Customer preferred cleaners",
        selectedCleaners: state.selectedCleaners.map(id => {
            const cleaner = cleaners.find(c => c.id === id);
            return cleaner ? cleaner.name : id;
        }),
        extras: Object.keys(state.extras).filter(name => state.extras[name]),
        extraQuantities: { ...state.extraQuantities },
        bedrooms: state.bedrooms,
        bathrooms: state.bathrooms,
        offices: state.offices,
        loads: state.loads,
        vehicle: state.vehicle,
        pets: state.pets,
        petDetails: $("#petDetails").value,
        instructions: $("#instructions").value,
        breakdown: state.breakdown,
        total: state.total,
        paymentMethod: $("#paymentMethod").value,
        paymentStatus: "DEMO_APPROVED",
        bookingStatus: "Pending",
        createdAt: new Date().toISOString()
    };

    try {
        await fetch("submit-booking.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(booking)
        });
    } catch (e) {}

    const savedBookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    savedBookings.push(booking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedBookings));

    $("#bookingReference").textContent = reference;
    $("#confirmedTotal").textContent = money(state.total);
    $("#confirmationTitle").textContent = "Payment approved";
    renderPaidSummary();
    $("#confirmationModal").classList.remove("hidden");

    localStorage.removeItem(PENDING_KEY);
    localStorage.removeItem(RETURN_TO_PAYMENT_KEY);
}

async function copyBookingReference() {
    const reference = $("#bookingReference").textContent;
    try {
        await navigator.clipboard.writeText(reference);
        $("#copyReference").textContent = "Copied!";
    } catch {
        alert("Please copy the booking reference manually.");
    }
}

function handleStepper(key, delta) {
    if (key === "hours") {
        state.hours += delta;
        updateHourLimit();
    }

    if (key === "cleanerCount") {
        state.cleanerCount = Math.min(4, Math.max(0, state.cleanerCount + delta));
        state.selectedCleaners = state.selectedCleaners.slice(0, state.cleanerCount);
        $("#cleanerCountValue").textContent = state.cleanerCount;
        renderCleaners();
    }

    updateAll();
}

function bindEvents() {
    $("#frequencyOptions").addEventListener("click", event => {
        const button = event.target.closest(".frequency-option");
        if (!button) return;
        changeFrequency(button.dataset.value);
    });

    $("#dayOptions").addEventListener("click", event => {
        const button = event.target.closest(".day-option");
        if (!button) return;
        selectPreferredDay(button);
    });

    $("#areaOptions").addEventListener("click", event => {
        const button = event.target.closest(".pill");
        if (!button) return;
        state.area = button.dataset.value;
        state.service = "";
        state.serviceId = 0;
        state.extras = {};
        state.extraQuantities = {};
        $$("#areaOptions .pill").forEach(item => {
            item.classList.toggle("active", item === button);
        });
        renderServiceOptions();
    });

    $("#serviceType").addEventListener("change", event => {
        state.service = event.target.value;
        state.extras = {};
        state.extraQuantities = {};
        renderServiceFields();
    });

    $("#vehicleType").addEventListener("change", event => {
        state.vehicle = event.target.value;
        updateAll();
    });

    $("#petOptions").addEventListener("click", event => {
        const button = event.target.closest(".pill");
        if (!button) return;
        state.pets = button.dataset.value;
        $$("#petOptions .pill").forEach(item => {
            item.classList.toggle("active", item === button);
        });
        $("#petDetailsWrap").classList.toggle("hidden", state.pets !== "Yes");
        updateAll();
    });

    $$("[data-step]").forEach(button => {
        button.addEventListener("click", () => {
            const key = button.dataset.step;
            const delta = Number(button.dataset.delta);
            if (key === "dailyCount" || key === "weekCount") {
                handleFrequencyStepper(key, delta);
            } else {
                handleStepper(key, delta);
            }
        });
    });

    $$('input[name="locationChoice"]').forEach(radio => {
        radio.addEventListener("change", () => {
            const different = radio.value === "different" && radio.checked;
            $("#locationFields").classList.toggle("hidden", !different);
            $("#savedAddress").classList.toggle("hidden", different);

            if (!different) {
                state.address = {
                    street: "14 Jacaranda Street",
                    building: "",
                    city: "Johannesburg",
                    province: "Gauteng",
                    postal: "2006"
                };
                state.selectedCleaners = [];
                renderCleaners();
                updateAll();
            }
        });
    });

    $("#addressSearch").addEventListener("input", event => {
        showSuggestions(event.target.value);
    });

    $("#saveAddress").addEventListener("click", () => {
        if (!validateAddress()) return;
        const address = state.address;
        $("#savedAddress").innerHTML = "";

        const icon = document.createElement("span");
        icon.className = "pin-icon";
        icon.textContent = "⌖";

        const details = document.createElement("span");
        const strong = document.createElement("strong");
        strong.textContent = address.street;

        const small = document.createElement("small");
        small.textContent = `${address.city}, ${address.province} ${address.postal}`;
        details.append(strong, small);

        const tag = document.createElement("span");
        tag.className = "saved-tag";
        tag.textContent = "Saved";

        $("#savedAddress").append(icon, details, tag);
        $("#savedAddress").classList.remove("hidden");
        $("#locationFields").classList.add("hidden");
        $('input[name="locationChoice"][value="saved"]').checked = true;

        renderCleaners();
        updateAll();
    });

    $("#startDate").addEventListener("change", event => {
        const selectedDate = event.target.value;
        const today = getToday();
        if (selectedDate && selectedDate < today) {
            alert("Please select today or a future date.");
            event.target.value = "";
            state.startDate = "";
            state.startTime = "";
            setupTimes();
            updateAll();
            return;
        }
        state.startDate = selectedDate;
        state.startTime = "";
        setupTimes();
        updateAll();
    });

    $("#startTime").addEventListener("change", event => {
        const selectedTime = event.target.value;
        const selectedDate = $("#startDate").value;
        const today = getToday();

        if (!selectedDate) {
            alert("Please select a date first.");
            event.target.value = "";
            return;
        }

        if (!selectedTime) {
            state.startTime = "";
            updateAll();
            return;
        }

        if (selectedDate < today) {
            alert("Past dates are not available.");
            event.target.value = "";
            state.startTime = "";
            setupTimes();
            return;
        }

        if (selectedDate === today) {
            const appointment = new Date(`${selectedDate}T${selectedTime}:00`);
            if (appointment <= new Date()) {
                alert("This appointment time has already passed. Please choose another time.");
                event.target.value = "";
                state.startTime = "";
                setupTimes();
                return;
            }
        }

        state.startTime = selectedTime;
        updateHourLimit();
        updateAll();
    });

    $("#pictures").addEventListener("change", event => {
        $("#fileList").textContent = [...event.target.files].map(file => file.name).join(" · ");
    });

    $("#proceedPayment").addEventListener("click", openPayment);
    $("#payNow").addEventListener("click", completePayment);

    $$("[data-close]").forEach(button => {
        button.addEventListener("click", () => {
            $("#" + button.dataset.close).classList.add("hidden");
        });
    });

    $$(".modal-backdrop").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) modal.classList.add("hidden");
        });
    });

    $("#copyReference").addEventListener("click", copyBookingReference);

    $("#viewBooking").addEventListener("click", () => {
        const bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        const latestBooking = bookings[bookings.length - 1];
        if (!latestBooking) {
            alert("No booking was found.");
            return;
        }
        alert(
            `Booking reference: ${latestBooking.reference}\n` +
            `Service: ${latestBooking.service}\n` +
            `Frequency: ${latestBooking.frequency}\n` +
            `Total: ${money(latestBooking.total)}`
        );
    });
}

function applyPreselectedServiceFromUrl(params) {
    const targetId = Number(params.get("service_id") || 0);
    const targetNameRaw = params.get("service") || "";
    const targetPrice = Number(params.get("price") || 0);
    const cleanTarget = targetNameRaw.replace(/^\d+\.\s*/, "").trim();
    const normTarget = normalizeServiceKey(cleanTarget);

    if (!targetId && !cleanTarget) return;

    let foundArea = "";
    let foundServiceName = "";

    for (const areaKey of ["Indoor", "Outdoor"]) {
        for (const srvName of Object.keys(services[areaKey])) {
            const srvObj = services[areaKey][srvName];
            if ((targetId > 0 && Number(srvObj.id) === targetId) ||
                (cleanTarget && (srvName.toLowerCase() === cleanTarget.toLowerCase() || normalizeServiceKey(srvName) === normTarget))) {
                foundArea = areaKey;
                foundServiceName = srvName;
                if (targetPrice > 0) {
                    srvObj.base = targetPrice;
                }
                break;
            }
        }
        if (foundServiceName) break;
    }

    if (!foundServiceName && cleanTarget) {
        foundArea = /outdoor|car\s*wash|exterior|patio|driveway/i.test(cleanTarget) ? "Outdoor" : "Indoor";
        foundServiceName = cleanTarget;
        services[foundArea][foundServiceName] = {
            id: targetId,
            base: targetPrice > 0 ? targetPrice : 150,
            guide: `${foundServiceName}: From ${money(targetPrice > 0 ? targetPrice : 150)}`,
            extras: []
        };
    }

    if (foundArea && foundServiceName) {
        state.area = foundArea;
        state.service = foundServiceName;
        state.serviceId = services[foundArea][foundServiceName].id || targetId;

        $$("#areaOptions .pill").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.value === foundArea);
        });

        renderServiceOptions();
        $("#serviceType").value = foundServiceName;
        renderServiceFields();
    }
}

async function init() {
    await syncServicesFromDatabase();

    const params = new URLSearchParams(window.location.search);
    const returningToPayment =
        params.get("continuePayment") === "true" &&
        localStorage.getItem(RETURN_TO_PAYMENT_KEY) === "true";

    loadCustomerDetails();

    let restored = false;
    if (returningToPayment) {
        restored = restorePendingBooking();
    }

    if (!restored) {
        localStorage.removeItem(PENDING_KEY);
        if (!returningToPayment) {
            localStorage.removeItem(RETURN_TO_PAYMENT_KEY);
        }

        state.cleanerCount = 0;
        state.selectedCleaners = [];
        $("#cleanerCountValue").textContent = "0";

        setTodayMinimum();

        state.area = "";
        state.service = "";
        state.serviceId = 0;
        state.extras = {};
        state.extraQuantities = {};

        $$("#areaOptions .pill").forEach(button => {
            button.classList.remove("active");
        });

        renderServiceOptions();
        renderCleaners();
        applyPreselectedServiceFromUrl(params);
    }

    bindEvents();

    $("#dailyCountValue").textContent = state.dailyCount;
    $("#weekCountValue").textContent = state.weekCount;
    $("#hoursValue").textContent = state.hours;
    $("#cleanerCountValue").textContent = state.cleanerCount;

    if (!restored) {
        changeFrequency("One-time");
    }

    updateAll();

    if (params.get("continuePayment") === "true") {
        if (!isCustomerLoggedIn()) {
            alert("Please sign in to continue.");
            redirectToLoginBeforePayment();
            return;
        }

        loadCustomerDetails();
        updateAll();
        setupTimes();

        if (!validateBooking()) {
            history.replaceState({}, document.title, window.location.pathname);
            localStorage.removeItem(RETURN_TO_PAYMENT_KEY);
            return;
        }

        openPaymentModal();
        history.replaceState({}, document.title, window.location.pathname);
    }
}

document.addEventListener("DOMContentLoaded", init);

const loginLink = document.getElementById("loginLink");
const profileContainer = document.getElementById("profileMenuContainer");

function updateAccountVisibility() {
    const loggedIn = localStorage.getItem("pileeTechLoggedIn") === "true" || Boolean(localStorage.getItem(LOGIN_KEY));
    if (loginLink) loginLink.hidden = loggedIn;
    if (profileContainer) profileContainer.hidden = !loggedIn;
}

updateAccountVisibility();

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("pileeTechLoggedIn");
        localStorage.removeItem(LOGIN_KEY);
        window.location.href = "index.html";
    });
}
