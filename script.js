
const WHATSAPP_NUMBER = "27781825521";

const SERVICES = {
  Instagram: [
    {
      name: "Followers",
      packages: [
        ["1k", 60],
        ["5k", 170],
        ["10k", 240],
        ["50k", 360]
      ]
    },
    {
      name: "Likes",
      packages: [["100k", 350]]
    },
    {
      name: "Views",
      packages: [["100k", 250]]
    },
    {
      name: "Blue tick",
      packages: [
        ["3 months", 250],
        ["1 year", 380]
      ]
    }
  ],

  YouTube: [
    {
      name: "Subscribers",
      packages: [
        ["1k", 250],
        ["5k", 1250],
        ["10k", 2500]
      ]
    },
    {
      name: "Watchtime",
      packages: [["4k hours", 600]]
    },
    {
      name: "Views",
      packages: [
        ["1k", 100],
        ["5k", 500],
        ["10k", 1000],
        ["50k", 2000]
      ]
    },
    {
      name: "Likes",
      packages: [
        ["1k", 130],
        ["5k", 650],
        ["10k", 1300],
        ["50k", 2600]
      ]
    }
  ]
};

const state = {
  mobile: "",
  platform: "",
  service: "",
  quantity: "",
  price: 0,
  link: ""
};

const $ = id => document.getElementById(id);

function showPage(id) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("active", page.id === id);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function money(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function notify(message) {
  alert(message);
}

/* PAGE 1: MOBILE ENTRY */

$("loginForm").addEventListener("submit", event => {
  event.preventDefault();

  const mobile = $("mobile").value.trim();
  const digits = mobile.replace(/\D/g, "");

  if (digits.length < 7) {
    notify("Please enter a valid mobile number.");
    return;
  }

  state.mobile = mobile;
  showPage("categoryPage");
});

/* PAGE 2: CATEGORY SELECTION */

document.querySelectorAll("[data-platform]").forEach(button => {
  button.addEventListener("click", () => {
    const platform = button.dataset.platform;

    if (!SERVICES[platform]) {
      notify("This service will be added soon!");
      return;
    }

    state.platform = platform;
    state.service = "";
    state.quantity = "";
    state.price = 0;

    renderServices();
    showPage("servicePage");
  });
});

/* PAGE 3: BUILD SERVICE CARDS */

function renderServices() {
  $("serviceTitle").innerHTML =
    escapeHTML(state.platform) + " <span>services</span>";

  $("serviceGroups").innerHTML = SERVICES[state.platform]
    .map((group, groupIndex) => `
      <div class="service-group">
        <h2>
          ${escapeHTML(group.name)}
          <small> · ${group.packages.length} packages</small>
        </h2>

        <div class="package-grid">
          ${group.packages.map((pkg, packageIndex) => `
            <button
              type="button"
              class="package"
              data-group="${groupIndex}"
              data-package="${packageIndex}">

              <strong>${escapeHTML(pkg[0])}</strong>
              <small>${escapeHTML(group.name)} package</small>
              <em>${money(pkg[1])}</em>
            </button>
          `).join("")}
        </div>
      </div>
    `).join("");

  $("selectedSummary").textContent = "Choose a package";
  $("selectedPrice").textContent = "₹0";
  $("continueBtn").disabled = true;

  document.querySelectorAll(".package").forEach(button => {
    button.addEventListener("click", () => {
      const group =
        SERVICES[state.platform][Number(button.dataset.group)];

      const selectedPackage =
        group.packages[Number(button.dataset.package)];

      state.service = group.name;
      state.quantity = selectedPackage[0];
      state.price = selectedPackage[1];

      document.querySelectorAll(".package").forEach(card => {
        card.classList.remove("selected");
      });

      button.classList.add("selected");

      $("selectedSummary").textContent =
        `${state.service} · ${state.quantity}`;

      $("selectedPrice").textContent = money(state.price);
      $("continueBtn").disabled = false;
    });
  });
}

/* BACK BUTTONS */

document.querySelectorAll("[data-back]").forEach(button => {
  button.addEventListener("click", () => {
    showPage(button.dataset.back);
  });
});

/* MOVE TO LINK PAGE */

$("continueBtn").addEventListener("click", () => {
  if (!state.service) {
    notify("Please select a service first.");
    return;
  }

  $("rPlatform").textContent = state.platform;
  $("rService").textContent = state.service;
  $("rQuantity").textContent = state.quantity;
  $("rPrice").textContent = money(state.price);

  showPage("linkPage");
});

/* LINK VALIDATION */

$("proceedBtn").addEventListener("click", () => {
  const link = $("targetLink").value.trim();

  let url;

  try {
    url = new URL(link);
  } catch {
    notify("Please enter a valid profile or post link.");
    return;
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    notify("Please enter a valid HTTP or HTTPS link.");
    return;
  }

  state.link = link;

  $("payAmount").textContent = money(state.price);
  $("pPlatform").textContent = state.platform;
  $("pService").textContent = state.service;
  $("pQuantity").textContent = state.quantity;
  $("pLink").textContent = state.link;

  showPage("paymentPage");
});

/* SUBMIT ORDER THROUGH WHATSAPP */

$("submitOrder").addEventListener("click", () => {
  const message = [
    "Hello Growth Tamilan!",
    "",
    "ORDER DETAILS",
    "----------------------",
    "Mobile: " + state.mobile,
    "Platform: " + state.platform,
    "Service: " + state.service,
    "Quantity: " + state.quantity,
    "Amount: " + money(state.price),
    "Link: " + state.link,
    "----------------------",
    "",
    "Please verify my order and payment before processing."
  ].join("\n");

  const whatsappURL =
    "https://wa.me/" +
    WHATSAPP_NUMBER +
    "?text=" +
    encodeURIComponent(message);

  // Open WhatsApp with a pre-filled message.
  // The customer must review and send the message.
  window.open(whatsappURL, "_blank");

  showPage("successPage");
});

/* RETURN TO CATEGORIES */

$("homeBtn").addEventListener("click", () => {
  showPage("categoryPage");
});
    
